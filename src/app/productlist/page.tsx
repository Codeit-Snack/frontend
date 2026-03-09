"use client"

import Pagination from "@/components/ui/pagination"
import { ProductListFilters } from "./_components/productlist-filters"
import { ProductListGrid } from "./_components/productlist-grid"
import { ProductListHeader } from "./_components/productlist-header"
import { useProducts } from "./_hooks/use-products"

export default function ProductListPage() {
  const {
    keyword,
    category,
    categories,
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
    setSort,
  } = useProducts()

  return (
    <main className="px-8 py-10">
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
          selectedCategory={category}
          onSelectCategory={setCategory}
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
    </main>
  )
}

/*
1. 헤더 수정
2. 검색창 유지할지?
3. 필터 선택 위치 수정
4. 카테고리 수정(대분류 소분류)
5. 상품등록 버튼 및 모달 추가
6. 사이드바 추가
*/
