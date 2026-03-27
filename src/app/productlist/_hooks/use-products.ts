"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { CATEGORIES, getSubCategoriesByCategoryId, SUB_CATEGORIES } from "@/data/categories"
import { getProducts } from "../_lib/api"
import type { Product, SortOption } from "../_lib/types"

const DEFAULT_PAGE_SIZE = 12

export function useProducts() {
  const [keyword, setKeyword] = useState("")
  const [debouncedKeyword, setDebouncedKeyword] = useState("")

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null)
  const [sort, setSort] = useState<SortOption>("latest")
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
    }, 300)

    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    let cancelled = false

    const categoryForApi = selectedSubCategoryId
      ? SUB_CATEGORIES.find((s) => s.id === selectedSubCategoryId)?.name
      : undefined
    const categoryIdForApi =
      selectedCategoryId && !selectedSubCategoryId ? selectedCategoryId : undefined

    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getProducts({
          keyword: debouncedKeyword,
          category: categoryForApi,
          categoryId: categoryIdForApi,
          sort,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
        })

        if (cancelled) return
        setProducts(result.products)
        setTotalPages(result.totalPages)
      } catch {
        if (cancelled) return
        setError("상품 목록을 불러오지 못했습니다.")
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [debouncedKeyword, selectedCategoryId, selectedSubCategoryId, sort, page])

  const sortLabel = useMemo(() => {
    switch (sort) {
      case "latest":
        return "최신순"
      case "priceAsc":
        return "가격 낮은순"
      case "priceDesc":
        return "가격 높은순"
      case "purchaseDesc":
        return "구매 많은순"
      default:
        return "정렬"
    }
  }, [sort])

  const handleChangeKeyword = useCallback((value: string) => {
    setKeyword(value)
    setPage(1)
  }, [])

  const handleSelectCategory = useCallback((categoryId: number | null) => {
    setSelectedCategoryId(categoryId)
    setSelectedSubCategoryId(null)
    setPage(1)
  }, [])

  const handleSelectSubCategory = useCallback((subCategoryId: number | null) => {
    setSelectedSubCategoryId(subCategoryId)
    setPage(1)
  }, [])

  const handleSelectSort = useCallback((next: SortOption) => {
    setSort(next)
    setPage(1)
  }, [])

  const sortOptions = useMemo(
    () =>
      [
        { value: "latest", label: "최신순" },
        { value: "priceAsc", label: "가격 낮은순" },
        { value: "priceDesc", label: "가격 높은순" },
        { value: "purchaseDesc", label: "구매 많은순" },
      ] as const,
    [],
  )

  const subCategories = useMemo(
    () =>
      selectedCategoryId
        ? getSubCategoriesByCategoryId(selectedCategoryId)
        : [],
    [selectedCategoryId],
  )

  return {
    keyword,
    categories: CATEGORIES,
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
    setKeyword: handleChangeKeyword,
    setCategory: handleSelectCategory,
    setSubCategory: handleSelectSubCategory,
    setSort: handleSelectSort,
  }
}
