import type {
  GetMonthlyBudgetDefaultResponse,
  PatchMonthlyBudgetDefaultBody,
  PostBudgetPeriodBody,
} from "./types"

const JSON_HEADERS = { "Content-Type": "application/json" } as const

/** 비어 있으면 같은 출처(Next)의 `/api/...` 호출. 예: `http://localhost:4000` */
function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? ""
  return base ? `${base}${path}` : path
}

async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return `요청 실패 (${res.status})`
  const trimmed = text.trim()
  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<HTML")
  ) {
    if (res.status === 404) {
      return "API 경로를 찾을 수 없습니다(404). 백엔드 주소 설정 또는 API 라우트를 확인하세요."
    }
    return `서버가 HTML을 반환했습니다(${res.status}). API URL이 올바른지 확인하세요.`
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
  const res = await fetch(apiUrl("/api/budget/monthly-default"), {
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
  const res = await fetch(apiUrl("/api/budget/monthly-default"), {
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
  const res = await fetch(apiUrl("/api/budget/periods"), {
    method: "POST",
    headers: JSON_HEADERS,
    credentials: "include",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
}
