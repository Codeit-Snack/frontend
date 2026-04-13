import { AUTH_ACCESS_TOKEN_KEY } from "@/lib/auth/constants"
import type {
  GetMonthlyBudgetDefaultResponse,
  PatchMonthlyBudgetDefaultBody,
  PostBudgetPeriodBody,
} from "./types"

let hasLoggedBudgetTokenClaims = false
let hasLoggedTokenSource = false

/**
 * Budget API is called via Next Route Handlers:
 * Browser -> /api/budget/* (same-origin) -> Next Route Handler -> Backend
 */
function budgetProxyPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return normalized.startsWith("/api/budget/") ? normalized : `/api/budget${normalized}`
}

function getAccessToken() {
  if (typeof window === "undefined") return null

  const snackAccessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY)
  if (snackAccessToken) {
    if (!hasLoggedTokenSource) {
      console.log(`[budget-token] using accessToken key: ${AUTH_ACCESS_TOKEN_KEY}`)
      hasLoggedTokenSource = true
    }
    return snackAccessToken
  }

  const fallbackToken =
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token") ??
    localStorage.getItem("authToken")
  if (!hasLoggedTokenSource) {
    console.log(
      fallbackToken
        ? "[budget-token] using fallback token key (accessToken/token/authToken)"
        : "[budget-token] no token found in localStorage",
    )
    hasLoggedTokenSource = true
  }
  return fallbackToken
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

function logTokenClaimsForDebug(token: string | null) {
  if (hasLoggedBudgetTokenClaims) return
  hasLoggedBudgetTokenClaims = true

  if (!token) {
    console.log("[budget-token] token missing")
    return
  }

  const payload = decodeJwtPayload(token)
  const expRaw = payload?.exp
  const exp = Number(expRaw)
  const nowSec = Math.floor(Date.now() / 1000)
  const organizationId =
    payload?.organizationId ??
    payload?.organization_id ??
    payload?.orgId ??
    payload?.org_id

  console.log("[budget-token] claims", {
    iss: payload?.iss,
    aud: payload?.aud,
    exp: Number.isFinite(exp) ? exp : expRaw,
    expISO: Number.isFinite(exp) ? new Date(exp * 1000).toISOString() : null,
    expired: Number.isFinite(exp) ? exp <= nowSec : null,
    organizationId,
  })
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
  const token = getAccessToken()
  logTokenClaimsForDebug(token)
  const organizationId = resolveOrganizationIdFromToken(token)
  const hasBody = init?.body !== undefined

  const url = budgetProxyPath(path)

  const response = await fetch(url, {
    ...init,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(organizationId ? { "X-Organization-Id": organizationId } : {}),
      ...(init?.headers ?? {}),
    },
  })

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
      throw new Error("Unauthorized: 로그인 상태 또는 토큰을 확인해주세요.")
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
  const o = data as Record<string, unknown>
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
  const compatibleBody = {
    defaultMonthlyBudget: body.defaultMonthlyBudget,
    default_monthly_budget: body.defaultMonthlyBudget,
  }
  await requestApi("/api/budget/monthly-default", {
    method: "PATCH",
    body: JSON.stringify(compatibleBody),
  })
}

/** POST /api/budget/periods */
export async function postBudgetPeriod(body: PostBudgetPeriodBody): Promise<void> {
  await requestApi("/api/budget/periods", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
