import { NextResponse } from "next/server"

function upstreamBase(): string | null {
  const raw = process.env.API_SERVER_BASE_URL?.trim()
  if (!raw) return null
  return raw.replace(/\/$/, "")
}

/** Swagger·로그인 API에서 받은 액세스 토큰(해당 서버가 서명 검증에 쓰는 값). */
function bearer(): string | null {
  let t = process.env.API_SERVER_BEARER_TOKEN?.trim()
  if (!t) return null
  if (t.toLowerCase().startsWith("bearer ")) {
    t = t.slice(7).trim()
  }
  return t || null
}

export function isUpstreamConfigured(): boolean {
  return upstreamBase() !== null
}

/**
 * `API_SERVER_BASE_URL`이 없으면 null (라우트에서 스텁 처리).
 * 있으면 원격으로 그대로 전달합니다.
 */
export async function proxyToUpstream(
  request: Request,
  path: string,
): Promise<Response> {
  const base = upstreamBase()
  if (!base) {
    return NextResponse.json(
      { message: "API_SERVER_BASE_URL is not set" },
      { status: 503 },
    )
  }

  const normalized = path.startsWith("/") ? path : `/${path}`
  const url = `${base}${normalized}`

  const headers = new Headers()
  const incomingCt = request.headers.get("content-type")
  if (incomingCt) headers.set("content-type", incomingCt)
  const token = bearer()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const method = request.method
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.text()

  const res = await fetch(url, {
    method,
    headers,
    body,
    cache: "no-store",
  })

  const out = new Headers()
  const ct = res.headers.get("content-type")
  if (ct) out.set("content-type", ct)

  return new NextResponse(res.body, { status: res.status, headers: out })
}
