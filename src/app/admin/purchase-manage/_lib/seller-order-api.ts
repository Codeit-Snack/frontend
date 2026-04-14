"use client";

import { AUTH_ACCESS_TOKEN_KEY } from "@/lib/auth/constants";
import { API_BASE_URL } from "@/lib/env";

export type SellerOrderStatus =
  | "PENDING_SELLER_APPROVAL"
  | "APPROVED"
  | "PURCHASED"
  | "REJECTED"
  | "CANCELED";

export interface SellerOrderListItem {
  id: number;
  status: SellerOrderStatus;
  purchaseRequestId: number;
  buyerOrganizationId: number;
  itemsAmount: string;
  createdAt: string;
  purchaseRequestStatus: string;
}

export interface SellerOrderListResult {
  data: SellerOrderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) ??
    localStorage.getItem("accessToken") ??
    localStorage.getItem("token") ??
    localStorage.getItem("authToken")
  );
}

function getDataPayload(payload: unknown): unknown {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: unknown }).data ?? null;
  }
  return payload;
}

function parseErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string") return payload.trim() || fallback;
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as Record<string, unknown>;
  const message = record.message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message) && message.length > 0) return String(message[0]);
  return fallback;
}

async function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

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

export async function getSellerPurchaseOrders(params: {
  page: number;
  limit: number;
  status?: SellerOrderStatus;
}): Promise<SellerOrderListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    ...(params.status ? { status: params.status } : {}),
  });

  const payload = await requestApi<unknown>(
    `/api/seller/purchase-orders?${query.toString()}`
  );
  const data = getDataPayload(payload);

  if (!data || typeof data !== "object") {
    return { data: [], total: 0, page: params.page, limit: params.limit, totalPages: 1 };
  }

  const record = data as Record<string, unknown>;
  return {
    data: Array.isArray(record.data) ? (record.data as SellerOrderListItem[]) : [],
    total: Number(record.total ?? 0),
    page: Number(record.page ?? params.page),
    limit: Number(record.limit ?? params.limit),
    totalPages: Math.max(1, Number(record.totalPages ?? 1)),
  };
}

export async function approveSellerPurchaseOrder(params: {
  orderId: number;
  decisionMessage?: string;
  shippingFee?: string;
}): Promise<unknown> {
  const payload = await requestApi<unknown>(
    `/api/seller/purchase-orders/${params.orderId}/approve`,
    {
      method: "POST",
      body: JSON.stringify({
        ...(params.decisionMessage ? { decisionMessage: params.decisionMessage } : {}),
        ...(params.shippingFee ? { shippingFee: params.shippingFee } : {}),
      }),
    }
  );
  return getDataPayload(payload);
}

export async function rejectSellerPurchaseOrder(params: {
  orderId: number;
  decisionMessage?: string;
}): Promise<unknown> {
  const payload = await requestApi<unknown>(
    `/api/seller/purchase-orders/${params.orderId}/reject`,
    {
      method: "POST",
      body: JSON.stringify({
        ...(params.decisionMessage ? { decisionMessage: params.decisionMessage } : {}),
      }),
    }
  );
  return getDataPayload(payload);
}
