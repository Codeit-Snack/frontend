import { NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/env";

/**
 * GET: 초대 토큰으로 수신 이메일 등 미리보기 (브라우저는 동일 출처로만 호출)
 */
export async function GET(req: Request) {
  const incoming = new URL(req.url);
  const qs = incoming.searchParams.toString();
  const upstreamUrl = `${API_BASE_URL}/api/invitations/signup${qs ? `?${qs}` : ""}`;

  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

/**
 * 브라우저 → Next(동일 출처) → 백엔드 초대 가입 프록시
 * (직접 API 도메인 호출 시 캐시·확장 프로그램·구번들과 섞일 여지를 줄입니다.)
 */
export async function POST(req: Request) {
  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json(
      { success: false, message: "요청 본문을 읽을 수 없습니다." },
      { status: 400 }
    );
  }

  const upstream = await fetch(`${API_BASE_URL}/api/invitations/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
