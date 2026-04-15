import { NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/env"

function buildHeaders(req: Request): Headers {
  const headers = new Headers()
  const authorization = req.headers.get("authorization")
  if (authorization) headers.set("authorization", authorization)
  const organizationId = req.headers.get("x-organization-id")
  if (organizationId) headers.set("x-organization-id", organizationId)
  return headers
}

/** 장바구니 조회 — 백엔드 `GET /cart` */
export async function GET(req: Request) {
  const incoming = new URL(req.url)
  const query = incoming.searchParams.toString()
  const upstreamUrl = `${API_BASE_URL}/cart${query ? `?${query}` : ""}`

  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: buildHeaders(req),
  })

  const text = await upstream.text()
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  })
}
