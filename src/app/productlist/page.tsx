"use client"

import { useState } from "react"
import Pagination from "@/components/ui/pagination"
import { ProductListAddProductButton } from "./_components/productlist-add-product-button"
import { ProductRegisterModal } from "./_components/product-register-modal"
import { ProductListFilters } from "./_components/productlist-filters"
import { ProductListGrid } from "./_components/productlist-grid"
import { ProductListHeader } from "./_components/productlist-header"
import { ProductListGlobalHeader } from "./_components/productlist-global-header"
import { useProducts } from "./_hooks/use-products"

export default function ProductListPage() {
  const {
    keyword,
    categories,
    subCategories,
    selectedCategoryId,
    selectedSubCategoryId,
    sort,
    sortLabel,
    sortOptions,
    page,
    products,
    totalPages,
    loading,
    error,
    setPage,
    setKeyword,
    setCategory,
    setSubCategory,
    setSort,
  } = useProducts()

  const [registerModalOpen, setRegisterModalOpen] = useState(false)

  const handleOpenRegisterModal = () => {
    setRegisterModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      <ProductListGlobalHeader />

      <main className="flex-1 px-8 py-10">
        <section className="mx-auto max-w-6xl">
          <ProductListHeader
            keyword={keyword}
            onChangeKeyword={setKeyword}
            sortLabel={sortLabel}
            sortOptions={sortOptions}
            selectedSort={sort}
            onSelectSort={setSort}
          />
          <ProductListFilters
            categories={categories}
            subCategories={subCategories}
            selectedCategoryId={selectedCategoryId}
            selectedSubCategoryId={selectedSubCategoryId}
            onSelectCategory={setCategory}
            onSelectSubCategory={setSubCategory}
          />

          {error ? (
            <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : (
            <ProductListGrid products={products} loading={loading} />
          )}

          <div className="mt-8 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </section>

        <ProductListAddProductButton onClick={handleOpenRegisterModal} />
      </main>

      <ProductRegisterModal
        open={registerModalOpen}
        onOpenChange={setRegisterModalOpen}
      />
    </div>
  )
}
