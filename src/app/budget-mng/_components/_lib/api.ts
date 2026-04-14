import {
  AUTH_ACCESS_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
} from "@/lib/auth/constants"
import type {
  GetMonthlyBudgetDefaultResponse,
  PatchMonthlyBudgetDefaultBody,
  PostBudgetPeriodBody,
} from "./types"

/**
 * Budget API is called via Next Route Handlers:
 * Browser -> /api/budget/* (same-origin) -> Next Route Handler -> Backend
 */
function budgetProxyPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return normalized.startsWith("/api/budget/")
    ? normalized
    : `/api/budget${normalized}`
}

function normalizeStoredToken(raw: string | null): string | null {
  if (raw == null) return null
  const t = raw.trim()
  return t.length > 0 ? t : null
}

function getAccessTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null
  return normalizeStoredToken(
    localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) ??
      localStorage.getItem("accessToken") ??
      localStorage.getItem("token") ??
      localStorage.getItem("authToken"),
  )
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) return null
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

/** exp가 없거나 파싱 실패면 만료로 보지 않음(불필요한 refresh 방지) */
function isAccessTokenExpiredOrExpiringSoon(
  token: string,
  skewSeconds = 60,
): boolean {
  const payload = decodeJwtPayload(token)
  const expRaw = payload?.exp
  if (expRaw === undefined || expRaw === null) return false
  const exp = Number(expRaw)
  if (!Number.isFinite(exp)) return false
  const nowSec = Math.floor(Date.now() / 1000)
  return exp <= nowSec + skewSeconds
}

function resolveOrganizationIdFromToken(token: string | null): string | null {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  const raw =
    payload?.organizationId ??
    payload?.organization_id ??
    payload?.orgId ??
    payload?.org_id
  if (raw === undefined || raw === null) return null
  const value = String(raw).trim()
  return value.length > 0 ? value : null
}

function persistTokensFromRefresh(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken)
}

/** 로그인 응답과 동일하게 `data.tokens` 또는 최상위에서 토큰 추출 */
function extractTokensFromRefreshPayload(data: Record<string, unknown>): {
  accessToken: string
  refreshToken: string
} | null {
  const fromObject = (t: Record<string, unknown> | undefined) => {
    if (!t) return null
    const access =
      (typeof t.accessToken === "string" && t.accessToken) ||
      (typeof t.access_token === "string" && t.access_token) ||
      null
    const refresh =
      (typeof t.refreshToken === "string" && t.refreshToken) ||
      (typeof t.refresh_token === "string" && t.refresh_token) ||
      null
    if (access && refresh) return { accessToken: access, refreshToken: refresh }
    return null
  }
  const nested = fromObject(data.tokens as Record<string, unknown> | undefined)
  if (nested) return nested
  return fromObject(data)
}

/**
 * `POST /api/auth/refresh` — 동일 출처 프록시 `src/app/api/auth/refresh/route.ts` 사용.
 */
async function tryRefreshAuthTokens(): Promise<boolean> {
  if (typeof window === "undefined") return false
  const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)?.trim()
  if (!refreshToken) return false

  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })

  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    return false
  }

  if (!res.ok || !body || typeof body !== "object") return false
  const o = body as Record<string, unknown>
  if (o.success !== true || !o.data || typeof o.data !== "object") return false
  const pair = extractTokensFromRefreshPayload(o.data as Record<string, unknown>)
  if (!pair) return false
  persistTokensFromRefresh(pair.accessToken, pair.refreshToken)
  return true
}

/**
 * 호출 직전: access 만료(또는 곧 만료)면 refresh 시도 후 최신 access 반환.
 * refresh 실패 시 null (저장된 access가 없을 때와 동일하게 처리).
 */
async function getAccessTokenForRequest(): Promise<string | null> {
  let access = getAccessTokenFromStorage()
  if (!access) return null

  if (!isAccessTokenExpiredOrExpiringSoon(access)) {
    return access
  }

  const ok = await tryRefreshAuthTokens()
  if (!ok) {
    return null
  }

  access = getAccessTokenFromStorage()
  return access
}

function parseErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string") {
    const trimmed = payload.trim()
    return trimmed ? trimmed : fallback
  }

  if (!payload || typeof payload !== "object") return fallback

  const data =
    "data" in (payload as Record<string, unknown>) &&
    (payload as { data?: unknown }).data &&
    typeof (payload as { data?: unknown }).data === "object"
      ? ((payload as { data?: unknown }).data as Record<string, unknown>)
      : null

  const candidates = [
    (payload as { message?: unknown }).message,
    (payload as { error?: unknown }).error,
    (payload as { detail?: unknown }).detail,
    data?.message,
    data?.error,
    data?.detail,
  ]

  const text = candidates.find((value) => typeof value === "string")
  return text ?? fallback
}

async function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  let token = await getAccessTokenForRequest()
  const organizationId = resolveOrganizationIdFromToken(token)
  const hasBody = init?.body !== undefined

  const url = budgetProxyPath(path)

  const doFetch = () =>
    fetch(url, {
      ...init,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(organizationId ? { "X-Organization-Id": organizationId } : {}),
        ...(init?.headers ?? {}),
      },
    })

  let response = await doFetch()

  // access 만료로 401이 온 경우 한 번만 refresh 후 재시도
  if (response.status === 401 && localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)) {
    const refreshed = await tryRefreshAuthTokens()
    if (refreshed) {
      token = getAccessTokenFromStorage()
      const orgId = resolveOrganizationIdFromToken(token)
      response = await fetch(url, {
        ...init,
        headers: {
          ...(hasBody ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(orgId ? { "X-Organization-Id": orgId } : {}),
          ...(init?.headers ?? {}),
        },
      })
    }
  }

  const text = await response.text()
  let json: unknown = null
  if (text) {
    try {
      json = JSON.parse(text) as unknown
    } catch {
      json = text
    }
  }

  if (!response.ok) {
    console.error("[budget-api] request failed", {
      method: init?.method ?? "GET",
      url,
      status: response.status,
      response: json,
    })
    if (response.status === 401) {
      throw new Error(
        parseErrorMessage(
          json,
          "Unauthorized: 로그인 상태 또는 토큰을 확인해주세요.",
        ),
      )
    }
    if (response.status === 403) {
      throw new Error("권한이 없습니다. super_admin 권한이 필요합니다.")
    }
    throw new Error(parseErrorMessage(json, "요청 처리에 실패했습니다."))
  }

  return json as T
}

function normalizeMonthlyDefault(data: unknown): GetMonthlyBudgetDefaultResponse {
  if (typeof data !== "object" || data === null) {
    return { defaultMonthlyBudget: 0 }
  }
  const root = data as Record<string, unknown>
  const inner =
    root.data !== undefined &&
    root.data !== null &&
    typeof root.data === "object" &&
    !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root
  const o = inner
  const camel = o.defaultMonthlyBudget
  const snake = o.default_monthly_budget
  const n =
    typeof camel === "number"
      ? camel
      : typeof snake === "number"
        ? snake
        : typeof camel === "string"
          ? Number(camel)
          : typeof snake === "string"
            ? Number(snake)
            : NaN
  return {
    defaultMonthlyBudget: Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0,
  }
}

/** GET /api/budget/monthly-default */
export async function getMonthlyBudgetDefault(): Promise<GetMonthlyBudgetDefaultResponse> {
  const payload = await requestApi<unknown>("/api/budget/monthly-default")
  return normalizeMonthlyDefault(payload)
}

/** PATCH /api/budget/monthly-default */
export async function patchMonthlyBudgetDefault(
  body: PatchMonthlyBudgetDefaultBody,
): Promise<void> {
  await requestApi("/api/budget/monthly-default", {
    method: "PATCH",
    body: JSON.stringify({ defaultMonthlyBudget: body.defaultMonthlyBudget }),
  })
}

/** POST /api/budget/periods */
export async function postBudgetPeriod(body: PostBudgetPeriodBody): Promise<void> {
  await requestApi("/api/budget/periods", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
