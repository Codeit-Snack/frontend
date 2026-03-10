"use client";

import { ProductRegisterHeader } from "./_components/product-register-header";
import { ProductRegisterTable } from "./_components/product-register-table";
import Pagination from "@/components/ui/pagination";
import { useProductRegistrations } from "./_hooks/use-product-registrations";

export default function ProductRegisterHistoryPage() {
  const {
    page,
    sort,
    sortOpen,
    setSortOpen,
    items,
    totalPages,
    loading,
    error,
    setPage,
    handleSortChange,
  } = useProductRegistrations();

  return (
    <main className="px-8 py-10">
        <section className="mx-auto max-w-6xl">
          <ProductRegisterHeader
            sort={sort}
            onSortChange={handleSortChange}
            isSortOpen={sortOpen}
            onSortOpenChange={setSortOpen}
          />
          {error ? (
            <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : (
            <ProductRegisterTable items={items} loading={loading} />
          )}
          {totalPages > 0 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                size="sm"
              />
            </div>
          )}
        </section>
    </main>
  );
}
