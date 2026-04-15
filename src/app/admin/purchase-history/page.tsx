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
import { getBudgetSummary } from "@/app/admin/purchase-manage/_lib/budget-api";
import { fetchMonthlyExpensesTotal } from "@/app/budget-mng/_components/_lib/api";

const ITEMS_PER_PAGE = 6;
const SUMMARY_CARDS_BASE = [
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

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

/** 현재 달(1–12) 기준 직전 달의 연·월 */
function getPreviousCalendarMonth(year: number, month: number): {
  year: number;
  month: number;
} {
  const d = new Date(year, month - 2, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

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
  const [monthlyExpenseAmount, setMonthlyExpenseAmount] = useState<number | null>(null);
  const [monthlyExpenseError, setMonthlyExpenseError] = useState<string | null>(null);
  const [monthlyExpenseReady, setMonthlyExpenseReady] = useState(false);
  const [monthlyBudgetCap, setMonthlyBudgetCap] = useState<number | null>(null);
  const [budgetSummaryError, setBudgetSummaryError] = useState<string | null>(null);
  const [summaryFinanceReady, setSummaryFinanceReady] = useState(false);
  const [lastMonthRemaining, setLastMonthRemaining] = useState<number | null>(null);
  const [lastMonthExpenseAmount, setLastMonthExpenseAmount] = useState<number | null>(null);
  const [ytdExpenseThisYear, setYtdExpenseThisYear] = useState<number | null>(null);
  const [ytdExpenseLastYear, setYtdExpenseLastYear] = useState<number | null>(null);
  const [yearExpenseReady, setYearExpenseReady] = useState(false);
  const [yearExpenseError, setYearExpenseError] = useState<string | null>(null);

  const remainingBudgetAmount = useMemo(() => {
    if (monthlyBudgetCap === null || monthlyExpenseAmount === null) return null;
    return monthlyBudgetCap - monthlyExpenseAmount;
  }, [monthlyBudgetCap, monthlyExpenseAmount]);

  const remainingVsLastMonthSubText = useMemo(() => {
    if (!summaryFinanceReady || remainingBudgetAmount === null) return null;
    if (lastMonthRemaining === null) {
      return "지난 달과 비교할 수 없어요";
    }
    const diff = remainingBudgetAmount - lastMonthRemaining;
    if (diff === 0) {
      return "지난 달과 남은 예산이 같아요";
    }
    if (diff > 0) {
      return `지난 달보다 ${formatWon(diff)} 더 많아요`;
    }
    return `지난 달보다 ${formatWon(Math.abs(diff))} 덜 남았어요`;
  }, [summaryFinanceReady, remainingBudgetAmount, lastMonthRemaining]);

  const ytdVsLastYearSubText = useMemo(() => {
    if (!yearExpenseReady) return null;
    if (ytdExpenseThisYear === null || ytdExpenseLastYear === null) {
      return "지난 해와 비교할 수 없어요";
    }
    const diff = ytdExpenseThisYear - ytdExpenseLastYear;
    if (diff === 0) {
      return "지난 해와 지출이 같아요";
    }
    if (diff > 0) {
      return `지난 해보다 ${formatWon(diff)} 더 지출했어요`;
    }
    return `지난 해보다 ${formatWon(Math.abs(diff))} 덜 지출했어요`;
  }, [yearExpenseReady, ytdExpenseThisYear, ytdExpenseLastYear]);

  const summaryCards = useMemo(() => {
    const cards = SUMMARY_CARDS_BASE.map((c) => ({ ...c }));
    const spent = cards[0];
    if (spent) {
      if (!monthlyExpenseReady) {
        spent.subText = "불러오는 중…";
        spent.amount = "-";
      } else if (monthlyExpenseError) {
        spent.subText = monthlyExpenseError;
        spent.amount = "-";
      } else if (monthlyExpenseAmount !== null) {
        spent.subText =
          lastMonthExpenseAmount !== null
            ? `지난 달 : ${formatWon(lastMonthExpenseAmount)}`
            : `지난 달 : ${formatWon(0)}`;
        spent.amount = formatWon(monthlyExpenseAmount);
      } else {
        spent.subText = "해당 월 지출 정보 없음";
        spent.amount = "-";
      }
    }
    const rb = cards[1];
    if (rb) {
      if (!summaryFinanceReady) {
        rb.subText = "불러오는 중…";
        rb.amount = "-";
      } else if (budgetSummaryError || monthlyExpenseError) {
        rb.subText =
          budgetSummaryError ??
          monthlyExpenseError ??
          "예산·지출 정보를 불러오지 못했습니다.";
        rb.amount = "-";
      } else if (remainingBudgetAmount !== null) {
        rb.subText = remainingVsLastMonthSubText ?? "지난 달과 비교할 수 없어요";
        rb.amount = formatWon(remainingBudgetAmount);
      } else {
        rb.subText = "예산 또는 지출을 확인할 수 없어 계산할 수 없습니다.";
        rb.amount = "-";
      }
    }
    const ytd = cards[2];
    if (ytd) {
      if (!yearExpenseReady) {
        ytd.subText = "불러오는 중…";
        ytd.amount = "-";
      } else if (yearExpenseError) {
        ytd.subText = yearExpenseError;
        ytd.amount = "-";
      } else if (ytdExpenseThisYear !== null) {
        ytd.subText = ytdVsLastYearSubText ?? "지난 해와 비교할 수 없어요";
        ytd.amount = formatWon(ytdExpenseThisYear);
      } else {
        ytd.subText = "올해 지출 합계를 계산할 수 없어요";
        ytd.amount = "-";
      }
    }
    return cards;
  }, [
    monthlyExpenseAmount,
    monthlyExpenseError,
    monthlyExpenseReady,
    budgetSummaryError,
    summaryFinanceReady,
    remainingBudgetAmount,
    remainingVsLastMonthSubText,
    lastMonthExpenseAmount,
    yearExpenseReady,
    yearExpenseError,
    ytdExpenseThisYear,
    ytdVsLastYearSubText,
  ]);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      setMonthlyExpenseReady(false);
      setSummaryFinanceReady(false);
      setBudgetSummaryError(null);
      setMonthlyExpenseError(null);
      setLastMonthRemaining(null);
      setLastMonthExpenseAmount(null);

      const prev = getPreviousCalendarMonth(year, month);

      const [budgetOutcome, expenseOutcome, budgetLastOutcome, expenseLastOutcome] =
        await Promise.allSettled([
          getBudgetSummary({ year, month }),
          fetchMonthlyExpensesTotal({ year, month }),
          getBudgetSummary(prev),
          fetchMonthlyExpensesTotal(prev),
        ]);

      if (cancelled) return;

      if (budgetOutcome.status === "fulfilled") {
        const cap = Number(budgetOutcome.value.budgetAmount);
        setMonthlyBudgetCap(Number.isFinite(cap) ? cap : null);
        setBudgetSummaryError(null);
      } else {
        setMonthlyBudgetCap(null);
        const reason = budgetOutcome.reason;
        setBudgetSummaryError(
          reason instanceof Error
            ? reason.message
            : "이번 달 예산 정보를 불러오지 못했습니다."
        );
      }

      if (expenseOutcome.status === "fulfilled") {
        setMonthlyExpenseAmount(expenseOutcome.value);
        setMonthlyExpenseError(null);
      } else {
        setMonthlyExpenseAmount(null);
        const reason = expenseOutcome.reason;
        setMonthlyExpenseError(
          reason instanceof Error
            ? reason.message
            : "이번 달 지출을 불러오지 못했습니다."
        );
      }

      if (expenseLastOutcome.status === "fulfilled") {
        setLastMonthExpenseAmount(expenseLastOutcome.value);
      } else {
        setLastMonthExpenseAmount(null);
      }

      let remLast: number | null = null;
      if (
        budgetLastOutcome.status === "fulfilled" &&
        expenseLastOutcome.status === "fulfilled"
      ) {
        const capLast = Number(budgetLastOutcome.value.budgetAmount);
        const expLast = expenseLastOutcome.value;
        if (Number.isFinite(capLast) && expLast !== null) {
          remLast = capLast - expLast;
        }
      }
      setLastMonthRemaining(remLast);

      setMonthlyExpenseReady(true);
      setSummaryFinanceReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** 올해 1월~당월 지출 합계 + 작년 동기간 합(비교용) */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const y = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const months = Array.from({ length: currentMonth }, (_, i) => i + 1);

      setYearExpenseReady(false);
      setYearExpenseError(null);
      setYtdExpenseThisYear(null);
      setYtdExpenseLastYear(null);

      try {
        const [thisYearParts, lastYearParts] = await Promise.all([
          Promise.all(
            months.map((m) =>
              fetchMonthlyExpensesTotal({ year: y, month: m }).catch(() => null)
            )
          ),
          Promise.all(
            months.map((m) =>
              fetchMonthlyExpensesTotal({ year: y - 1, month: m }).catch(() => null)
            )
          ),
        ]);
        if (cancelled) return;
        const sumThis = thisYearParts.reduce<number>((acc, v) => acc + (v ?? 0), 0);
        const sumLast = lastYearParts.reduce<number>((acc, v) => acc + (v ?? 0), 0);
        setYtdExpenseThisYear(sumThis);
        setYtdExpenseLastYear(sumLast);
        setYearExpenseError(null);
      } catch (e) {
        if (!cancelled) {
          setYtdExpenseThisYear(null);
          setYtdExpenseLastYear(null);
          setYearExpenseError(
            e instanceof Error ? e.message : "올해 지출 합계를 불러오지 못했습니다."
          );
        }
      } finally {
        if (!cancelled) setYearExpenseReady(true);
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
            {summaryCards.map((card) => (
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
