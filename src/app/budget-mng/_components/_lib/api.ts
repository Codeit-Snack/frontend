import type {
  GetMonthlyBudgetDefaultResponse,
  PatchMonthlyBudgetDefaultBody,
  PostBudgetPeriodBody,
} from "./types"

const JSON_HEADERS = { "Content-Type": "application/json" } as const

/**
 * 예산 API는 브라우저에서 Render로 직접 가지 않고, Next 라우트(`budget-mng/api/budget/*`)만 호출합니다.
 * 원격 URL·`API_SERVER_BEARER_TOKEN`은 서버 프록시(`API_SERVER_BASE_URL`)에서만 사용합니다.
 */
function budgetProxyUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized.startsWith("/api/budget/")) {
    return `/budget-mng${normalized}`
  }
  return normalized
}

async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return `Request failed (${res.status})`
  const trimmed = text.trim()
  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<HTML")
  ) {
    if (res.status === 404) {
      return "API path not found (404). Check backend address or API route."
    }
    return `Server returned HTML (${res.status}). Check if API URL is correct.`
  }
  try {
    const j = JSON.parse(text) as { message?: string; error?: string }
    return j.message ?? j.error ?? text
  } catch {
    return text.length > 200 ? `${text.slice(0, 200)}…` : text
  }
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
  const res = await fetch(budgetProxyUrl("/api/budget/monthly-default"), {
    credentials: "include",
  })
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  const json: unknown = await res.json()
  return normalizeMonthlyDefault(json)
}

/** PATCH /api/budget/monthly-default */
export async function patchMonthlyBudgetDefault(
  body: PatchMonthlyBudgetDefaultBody,
): Promise<void> {
  const res = await fetch(budgetProxyUrl("/api/budget/monthly-default"), {
    method: "PATCH",
    headers: JSON_HEADERS,
    credentials: "include",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
}

/** POST /api/budget/periods */
export async function postBudgetPeriod(body: PostBudgetPeriodBody): Promise<void> {
  const res = await fetch(budgetProxyUrl("/api/budget/periods"), {
    method: "POST",
    headers: JSON_HEADERS,
    credentials: "include",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
}
