import { NextResponse } from "next/server"

import { isUpstreamConfigured, proxyToUpstream } from "../../../_components/_lib/upstream"

export async function POST(request: Request) {
  if (!isUpstreamConfigured()) {
    await request.json().catch(() => null)
    return new NextResponse(null, { status: 204 })
  }
  return proxyToUpstream(request, "/api/budget/periods")
}
