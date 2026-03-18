"use client";

import { useMemo, useState, useCallback } from "react";
import { Header, CONTENT_PADDING_X } from "@/components/header";
import { useDevice } from "@/hooks/use-device";
import Pagination from "@/components/ui/pagination";
import type { PurchaseRequestItem, PurchaseRequestSort } from "./_types";
import { SEED_PURCHASE_REQUESTS } from "./_data";
import { SortDropdown } from "./_components/SortDropdown";
import { PurchaseRequestTable } from "./_components/PurchaseRequestTable";
import { PurchaseRequestCard } from "./_components/PurchaseRequestCard";
import { EmptyState } from "./_components/EmptyState";
import { ConfirmCancelModal } from "./_components/ConfirmCancelModal";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

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

export default function PurchaseRequestsPage() {
  const device = useDevice();
  const [sort, setSort] = useState<PurchaseRequestSort>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PurchaseRequestItem | null>(null);
  const [items, setItems] = useState<PurchaseRequestItem[]>(SEED_PURCHASE_REQUESTS);

  const sortedItems = useMemo(() => sortItems(items, sort), [items, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / ITEMS_PER_PAGE));
  const pageItems = useMemo(
    () => paginate(sortedItems, currentPage, ITEMS_PER_PAGE),
    [sortedItems, currentPage]
  );

  const handleCancelRequest = useCallback((item: PurchaseRequestItem) => {
    setCancelTarget(item);
    setModalOpen(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    if (!cancelTarget) return;
    setItems((prev) =>
      prev.filter((i) => i.id !== cancelTarget.id)
    );
    setCancelTarget(null);
  }, [cancelTarget]);

  const isMobile = device === "mobile";

  return (
    <div className="min-h-screen bg-[var(--gray-gray-50)]">
      <Header
        device={device}
        isLoggedIn
        role="member"
        cartCount={2}
      />

      <main className={cn(CONTENT_PADDING_X, "pb-12 pt-6 md:pt-8")}>
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              구매 요청 내역
            </h1>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {sortedItems.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {isMobile ? (
                <div className="rounded-lg border border-[var(--gray-gray-200)] bg-white px-4">
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
                  items={pageItems}
                  onCancelRequest={handleCancelRequest}
                />
              )}

              <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <p className="text-sm text-gray-500">
                  전체 {sortedItems.length}건 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, sortedItems.length)}건
                </p>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
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
