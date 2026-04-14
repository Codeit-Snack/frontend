"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { Header, CONTENT_PADDING_X } from "@/components/header";
import { useAuthHeader } from "@/hooks/use-auth-header";
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

const ITEMS_PER_PAGE = 6;

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

export default function PurchaseManagePage() {
  const device = useDevice();
  const { isLoggedIn, role } = useAuthHeader();
  const [sort, setSort] = useState<PurchaseRequestSort>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PurchaseRequestItem | null>(null);
  const [items, setItems] = useState<PurchaseRequestItem[]>(SEED_PURCHASE_REQUESTS);

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

  return (
    <div className="min-h-screen background_background_400_b">
      <Header
        device={device}
        isLoggedIn={isLoggedIn}
        role={role}
        cartCount={2}
      />

      <main className={cn(CONTENT_PADDING_X, "pb-12 pt-3.5 md:pt-10")}>
        <div className="mx-auto w-full max-w-[1680px]">
          <div className="mb-4 flex items-center justify-between md:mb-10">
            <h1 className="font-[Pretendard] text-[20px] font-semibold leading-[32px] text-[var(--black-black-400,#1F1F1F)] md:text-[32px] md:leading-[42px]">
              구매 요청 관리
            </h1>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {sortedItems.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {isMobile ? (
                <div
                  key={safePage}
                  className="-mx-[clamp(24px,6.25vw,120px)] md:mx-0"
                >
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
                  onCancelRequest={handleCancelRequest}
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
