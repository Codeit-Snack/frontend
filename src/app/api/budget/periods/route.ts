import { NextResponse } from "next/server"

import { API_BASE_URL } from "@/lib/env"

function buildHeaders(req: Request): Headers {
  const headers = new Headers()
  const authorization = req.headers.get("authorization")
  if (authorization) headers.set("authorization", authorization)
  const contentType = req.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  return headers
}

export async function POST(req: Request) {
  let body: string
  try {
    body = await req.text()
  } catch {
    return NextResponse.json(
      { success: false, message: "요청 본문을 읽을 수 없습니다." },
      { status: 400 },
    )
  }

  const upstream = await fetch(`${API_BASE_URL}/api/budget/periods`, {
    method: "POST",
    headers: buildHeaders(req),
    body,
  })

  const text = await upstream.text()
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  })
}

