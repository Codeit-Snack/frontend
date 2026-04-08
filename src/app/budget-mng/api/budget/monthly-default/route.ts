import { NextResponse } from "next/server"

import { isUpstreamConfigured, proxyToUpstream } from "../../../_components/_lib/upstream"

/**
 * `API_SERVER_BASE_URL` + `API_SERVER_BEARER_TOKEN` 이 있으면 원격 API로 프록시.
 * 없으면 로컬 스텁(개발용).
 */
export async function GET() {
  if (!isUpstreamConfigured()) {
    return NextResponse.json({ defaultMonthlyBudget: 0 })
  }
  // 실제 요청 URL은 proxyToUpstream의 path + API_SERVER_BASE_URL로 만들어짐. 여기 URL은 Request 생성용 더미.
  const req = new Request("http://localhost/", { method: "GET" })
  return proxyToUpstream(req, "/api/budget/monthly-default")
}

export async function PATCH(request: Request) {
  if (!isUpstreamConfigured()) {
    await request.json().catch(() => null)
    return new NextResponse(null, { status: 204 })
  }
  return proxyToUpstream(request, "/api/budget/monthly-default")
}
