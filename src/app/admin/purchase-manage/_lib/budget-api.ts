"use client";

import { AUTH_ACCESS_TOKEN_KEY } from "@/lib/auth/constants";
import { API_BASE_URL } from "@/lib/env";

export interface BudgetSummaryResult {
  year: number;
  month: number;
  budgetAmount: string;
  spentAmount: string;
  reservedActiveAmount: string;
  remainingAmount: string;
  hasPeriodConfigured: boolean;
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

export async function getBudgetSummary(params: {
  year: number;
  month: number;
}): Promise<BudgetSummaryResult> {
  const query = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
  });
  const payload = await requestApi<unknown>(`/api/budget/periods/summary?${query.toString()}`);
  return getDataPayload(payload) as BudgetSummaryResult;
}
