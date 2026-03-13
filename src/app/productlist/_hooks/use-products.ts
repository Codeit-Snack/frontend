"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getProductCategories, getProducts } from "../_lib/api"
import type { Product, SortOption } from "../_lib/types"

const DEFAULT_PAGE_SIZE = 12

export function useProducts() {
  const [keyword, setKeyword] = useState("")
  const [debouncedKeyword, setDebouncedKeyword] = useState("")

  const [category, setCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("latest")
  const [page, setPage] = useState(1)

  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
    }, 300)

    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const values = await getProductCategories()
        if (cancelled) return
        setCategories(values)
      } catch {
        if (cancelled) return
        setCategories([])
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getProducts({
          keyword: debouncedKeyword,
          category: category ?? undefined,
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
  }, [debouncedKeyword, category, sort, page])

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

  const handleSelectCategory = useCallback((next: string | null) => {
    setCategory(next)
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

  return {
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
    setKeyword: handleChangeKeyword,
    setCategory: handleSelectCategory,
    setSort: handleSelectSort,
  }
}

