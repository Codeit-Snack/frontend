/**
 * 공통 API 베이스 URL.
 * `.env.local`에 `NEXT_PUBLIC_API_BASE_URL`을 두면 덮어씁니다. (`.env.example` 참고)
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://snack-xlvk.onrender.com";
