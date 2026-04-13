import { AUTH_ACCESS_TOKEN_KEY } from "@/lib/auth/constants";
import { API_BASE_URL } from "@/lib/env";
import type {
  PurchaseRequestItem,
  PurchaseRequestStatus,
} from "./_types";

const REQUEST_TIMEOUT_MS = 15000;
const FALLBACK_IMAGE_URL = "/assets/purchase_request_details/cola.png";

type PurchaseRequestListResponse = {
  data?: unknown[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

export type PurchaseRequestDetailItem = {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
};

export type PurchaseRequestDetailData = {
  id: string;
  requestDate: string;
  requester: string;
  requestMessage: string;
  approvalDate: string;
  manager: string;
  statusLabel: string;
  resultMessage: string;
  items: PurchaseRequestDetailItem[];
};

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) ??
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token") ??
    localStorage.getItem("authToken")
  );
}

function parseErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string") {
    const trimmed = payload.trim();
    return trimmed || fallback;
  }

  if (!payload || typeof payload !== "object") return fallback;

  const row = payload as Record<string, unknown>;
  const data =
    row.data && typeof row.data === "object"
      ? (row.data as Record<string, unknown>)
      : null;

  const text =
    (typeof row.message === "string" && row.message) ||
    (typeof row.error === "string" && row.error) ||
    (typeof row.detail === "string" && row.detail) ||
    (typeof data?.message === "string" && data.message) ||
    (typeof data?.error === "string" && data.error) ||
    (typeof data?.detail === "string" && data.detail) ||
    "";

  return text || fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toPrice(value: unknown): number {
  if (typeof value === "string") return toNumber(value, 0);
  return toNumber(value, 0);
}

function formatDate(dateLike: unknown): string {
  if (typeof dateLike !== "string" || !dateLike) return "-";
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function toStatus(status: unknown): PurchaseRequestStatus {
  const s = typeof status === "string" ? status.toUpperCase() : "";
  if (s === "REJECTED" || s === "CANCELED") return "rejected";
  if (s === "APPROVED" || s === "PURCHASED" || s === "COMPLETED") return "approved";
  return "pending";
}

function toStatusLabel(status: unknown): string {
  const s = typeof status === "string" ? status.toUpperCase() : "";
  if (s === "OPEN") return "승인 대기";
  if (s === "PARTIALLY_APPROVED") return "부분 승인";
  if (s === "READY_TO_PURCHASE") return "구매 준비 완료";
  if (s === "APPROVED") return "승인 완료";
  if (s === "PURCHASED") return "구매 완료";
  if (s === "REJECTED") return "구매 반려";
  if (s === "CANCELED") return "요청 취소";
  return "-";
}

async function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const hasBody = init?.body !== undefined;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");
    }
    throw new Error("네트워크 오류가 발생했습니다. 연결 상태를 확인해주세요.");
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = text;
    }
  }

  if (!response.ok) {
    throw new Error(parseErrorMessage(json, "요청 처리에 실패했습니다."));
  }

  return json as T;
}

export async function getPurchaseRequests(params: {
  page: number;
  limit: number;
}): Promise<{ items: PurchaseRequestItem[]; totalPages: number }> {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  const payload = await requestApi<PurchaseRequestListResponse>(
    `/api/purchase-requests?${query.toString()}`,
  );

  const rows = Array.isArray(payload.data) ? payload.data : [];

  const items = rows
    .map((raw): PurchaseRequestItem | null => {
      if (!raw || typeof raw !== "object") return null;
      const row = raw as Record<string, unknown>;
      const id = row.id;
      if (id === undefined || id === null) return null;
      const itemCount = toNumber(row.itemCount, 0);
      return {
        id: String(id),
        requestDate: formatDate(row.requestedAt),
        productSummary: `요청 품목 ${itemCount}건`,
        totalQuantity: itemCount,
        totalAmount: toPrice(row.totalAmount),
        status: toStatus(row.status),
        imageUrl: FALLBACK_IMAGE_URL,
      };
    })
    .filter((item): item is PurchaseRequestItem => item !== null);

  const totalPages = Math.max(1, toNumber(payload.totalPages, 1));
  return { items, totalPages };
}

export async function getPurchaseRequestDetail(
  requestId: string,
): Promise<PurchaseRequestDetailData> {
  const payload = await requestApi<unknown>(`/api/purchase-requests/${requestId}`);
  if (!payload || typeof payload !== "object") {
    throw new Error("구매 요청 상세 응답 형식이 올바르지 않습니다.");
  }
  const row = payload as Record<string, unknown>;
  const rawItems = Array.isArray(row.items) ? row.items : [];

  const items = rawItems
    .map((raw): PurchaseRequestDetailItem | null => {
      if (!raw || typeof raw !== "object") return null;
      const item = raw as Record<string, unknown>;
      const id = item.id;
      if (id === undefined || id === null) return null;
      return {
        id: String(id),
        name: String(item.productNameSnapshot ?? "").trim() || "이름 없는 상품",
        category: "카테고리 정보 없음",
        unitPrice: toPrice(item.unitPriceSnapshot),
        quantity: toNumber(item.quantity, 0),
        imageUrl: FALLBACK_IMAGE_URL,
      };
    })
    .filter((item): item is PurchaseRequestDetailItem => item !== null);

  return {
    id: String(row.id ?? requestId),
    requestDate: formatDate(row.requestedAt),
    requester: row.requesterUserId ? `사용자 #${String(row.requesterUserId)}` : "-",
    requestMessage:
      typeof row.requestMessage === "string" && row.requestMessage.trim()
        ? row.requestMessage
        : "-",
    approvalDate: formatDate(row.updatedAt),
    manager: "-",
    statusLabel: toStatusLabel(row.status),
    resultMessage: "-",
    items,
  };
}

export async function cancelPurchaseRequest(requestId: string): Promise<void> {
  await requestApi(`/api/purchase-requests/${requestId}/cancel`, {
    method: "POST",
  });
}
