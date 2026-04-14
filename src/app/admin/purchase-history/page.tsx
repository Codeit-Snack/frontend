"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { Header, CONTENT_PADDING_X } from "@/components/header";
import { useAuthHeader } from "@/hooks/use-auth-header";
import { useDevice } from "@/hooks/use-device";
import Pagination from "@/components/ui/pagination";
import type { PurchaseRequestItem, PurchaseRequestSort } from "./_types";
import { SortDropdown } from "./_components/SortDropdown";
import { PurchaseRequestTable } from "./_components/PurchaseRequestTable";
import { PurchaseRequestCard } from "./_components/PurchaseRequestCard";
import { EmptyState } from "./_components/EmptyState";
import { ConfirmCancelModal } from "./_components/ConfirmCancelModal";
import { AUTH_ACCESS_TOKEN_KEY } from "@/lib/auth/constants";
import { API_BASE_URL } from "@/lib/env";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;
const SUMMARY_CARDS = [
  {
    title: "이번 달 지출액",
    subText: "데이터 연동 예정",
    amount: "-",
    gridClassName: "col-span-1 xl:col-span-3",
  },
  {
    title: "이번 달 남은 예산",
    subText: "데이터 연동 예정",
    amount: "-",
    gridClassName: "col-span-1 xl:col-span-3",
  },
  {
    title: "올해 총 지출액",
    subText: "데이터 연동 예정",
    amount: "-",
    gridClassName: "col-span-2 xl:col-span-3",
  },
];

function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function pickList(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  const data =
    p.data && typeof p.data === "object"
      ? (p.data as Record<string, unknown>)
      : p;
  if (Array.isArray(data.items)) return data.items as Record<string, unknown>[];
  if (Array.isArray(data.list)) return data.list as Record<string, unknown>[];
  if (Array.isArray(data.content)) return data.content as Record<string, unknown>[];
  if (Array.isArray(data.orders)) return data.orders as Record<string, unknown>[];
  if (Array.isArray(data.purchaseOrders))
    return data.purchaseOrders as Record<string, unknown>[];
  return [];
}

function toHistoryItem(raw: Record<string, unknown>): PurchaseRequestItem | null {
  const itemList = Array.isArray(raw.items) ? (raw.items as Record<string, unknown>[]) : [];
  const firstItem = itemList[0] ?? {};
  const id = String(raw.id ?? raw.orderId ?? raw.purchaseOrderId ?? "").trim();
  if (!id) return null;
  const totalQuantity =
    Number(raw.totalQuantity ?? raw.quantity ?? raw.totalCount) ||
    itemList.reduce((acc, cur) => acc + Number(cur.quantity ?? 0), 0);
  const totalAmount = Number(raw.totalAmount ?? raw.amount ?? raw.totalPrice ?? 0);
  const productName =
    String(
      raw.productSummary ??
        raw.productName ??
        firstItem.productName ??
        firstItem.name ??
        "구매 품목",
    ).trim() || "구매 품목";
  const summary =
    itemList.length > 1 ? `${productName} 외 ${itemList.length - 1}건` : productName;

  return {
    id,
    requestDate: formatDate(raw.requestedAt ?? raw.requestDate ?? raw.createdAt),
    approvalDate: formatDate(raw.approvedAt ?? raw.approvalDate ?? raw.updatedAt),
    requester: String(
      raw.requesterName ?? raw.requester ?? raw.requestedByName ?? "요청자",
    ),
    manager: String(raw.managerName ?? raw.approverName ?? raw.manager ?? "담당자"),
    productSummary: summary,
    totalQuantity: Number.isFinite(totalQuantity) ? totalQuantity : 0,
    totalAmount: Number.isFinite(totalAmount) ? totalAmount : 0,
    status: "approved",
    imageUrl:
      typeof firstItem.imageUrl === "string"
        ? firstItem.imageUrl
        : typeof firstItem.thumbnailUrl === "string"
          ? firstItem.thumbnailUrl
          : undefined,
  };
}

async function fetchApprovedPurchaseHistory(): Promise<PurchaseRequestItem[]> {
  if (typeof window === "undefined") return [];
  const token = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY)?.trim();
  if (!token) throw new Error("로그인이 필요합니다.");

  const paths = [
    "/api/seller/purchase-orders?status=APPROVED",
    "/api/seller/purchase-orders?approvalStatus=APPROVED",
    "/api/seller/purchase-orders/approved",
  ];

  for (const path of paths) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 404) continue;
      throw new Error(`구매내역 조회에 실패했습니다. (${res.status})`);
    }
    const body: unknown = await res.json().catch(() => null);
    const list = pickList(body).map(toHistoryItem).filter((v): v is PurchaseRequestItem => Boolean(v));
    return list;
  }

  return [];
}

function sortItems(
  items: PurchaseRequestItem[],
  sort: PurchaseRequestSort
): PurchaseRequestItem[] {
  const copy = [...items];
  if (sort === "latest") {
    copy.sort((a, b) => (b.requestDate > a.requestDate ? 1 : -1));
  } else if (sort === "amountAsc") {
    copy.sort((a, b) => a.totalAmount - b.totalAmount);
  } else {
    copy.sort((a, b) => b.totalAmount - a.totalAmount);
  }
  return copy;
}

function paginate<T>(list: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return list.slice(start, start + perPage);
}

export default function PurchaseHistoryPage() {
  const device = useDevice();
  const { isLoggedIn, role } = useAuthHeader();
  const [sort, setSort] = useState<PurchaseRequestSort>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PurchaseRequestItem | null>(null);
  const [items, setItems] = useState<PurchaseRequestItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const sortedItems = useMemo(() => sortItems(items, sort), [items, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageItems = useMemo(
    () => paginate(sortedItems, safePage, ITEMS_PER_PAGE),
    [sortedItems, safePage]
  );

  const handleCancelRequest = useCallback((item: PurchaseRequestItem) => {
    setCancelTarget(item);
    setModalOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    if (!cancelTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== cancelTarget.id));
    setCancelTarget(null);
  }, [cancelTarget]);

  const isMobile = device === "mobile";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchApprovedPurchaseHistory();
        if (!cancelled) {
          setItems(list);
          setLoadError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setItems([]);
          setLoadError(e instanceof Error ? e.message : "구매내역을 불러오지 못했습니다.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen background_background_400_b">
      <Header device={device} isLoggedIn={isLoggedIn} role={role} cartCount={2} />

      <main className={cn(CONTENT_PADDING_X, "pb-12 pt-3.5 md:pt-10")}>
        <div className="mx-auto w-full max-w-[1680px]">
          <h1 className="font-[Pretendard] text-[20px] font-semibold leading-[32px] text-[var(--black-black-400,#1F1F1F)] md:text-[32px] md:leading-[42px]">
            구매 내역 확인
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-10 xl:grid-cols-12">
            {SUMMARY_CARDS.map((card) => (
              <article
                key={card.title}
                className={cn(
                  "rounded-[16px] border border-[var(--gray-gray-200,#E0E0E0)] bg-[var(--gray-gray-50,#FCFCFC)] px-6 py-5",
                  card.gridClassName
                )}
              >
                <p className="font-[Pretendard] text-[24px] font-bold leading-[32px] text-[var(--black-black-200,#525252)]">
                  {card.title}
                </p>
                <p className="mt-1 font-[Pretendard] text-[20px] font-medium leading-[32px] text-[var(--gray-gray-400,#ABABAB)]">
                  {card.subText}
                </p>
                <p className="mt-5 font-[Pretendard] text-[32px] font-bold leading-[42px] text-[var(--black-black-200,#525252)]">
                  {card.amount}
                </p>
              </article>
            ))}
          </div>

          <div className="mb-4 mt-4 flex items-center justify-end md:mb-10 md:mt-6">
            <SortDropdown value={sort} onChange={setSort} />
          </div>
          {loadError ? (
            <p className="mb-6 text_sm_medium text-[#F97B22]" role="alert">
              {loadError}
            </p>
          ) : null}

          {sortedItems.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {isMobile ? (
                <div key={safePage} className="-mx-[clamp(24px,6.25vw,120px)] md:mx-0">
                  {pageItems.map((item) => (
                    <PurchaseRequestCard
                      key={item.id}
                      item={item}
                      onCancelRequest={handleCancelRequest}
                    />
                  ))}
                </div>
              ) : (
                <PurchaseRequestTable
                  key={safePage}
                  items={pageItems}
                />
              )}

              <div className="mt-6 flex w-full flex-col items-center justify-center sm:mt-8 sm:flex-row sm:justify-center">
                {totalPages > 1 && (
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    size="sm"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <ConfirmCancelModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setCancelTarget(null);
        }}
        productSummary={cancelTarget?.productSummary ?? ""}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
