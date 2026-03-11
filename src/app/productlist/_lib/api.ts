import { mockProducts } from "./mock-data"
import type { GetProductsParams, GetProductsResult, Product, SortOption } from "./types"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function sortProducts(products: Product[], sort: SortOption) {
  const copied = [...products]

  switch (sort) {
    case "latest":
      return copied.sort((a, b) => b.id - a.id)
    case "priceAsc":
      return copied.sort((a, b) => a.price - b.price)
    case "priceDesc":
      return copied.sort((a, b) => b.price - a.price)
    case "purchaseDesc":
      return copied.sort((a, b) => b.purchaseCount - a.purchaseCount)
    default:
      return copied
  }
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<GetProductsResult> {
  const {
    keyword = "",
    category,
    sort = "latest",
    page = 1,
    pageSize = 12,
  } = params

  const normalizedKeyword = keyword.trim().toLowerCase()

  const filteredByKeyword = normalizedKeyword
    ? mockProducts.filter((product) =>
        product.name.toLowerCase().includes(normalizedKeyword),
      )
    : mockProducts

  const filtered = category
    ? filteredByKeyword.filter((product) => product.category === category)
    : filteredByKeyword

  const sorted = sortProducts(filtered, sort)

  const totalCount = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize

  await sleep(150)

  return {
    products: sorted.slice(start, end),
    totalCount,
    totalPages,
    page: currentPage,
  }
}

export async function getProductById(productId: number): Promise<Product | null> {
  await sleep(120)
  return mockProducts.find((product) => product.id === productId) ?? null
}

export async function getProductCategories(): Promise<string[]> {
  await sleep(50)
  const set = new Set<string>()
  for (const product of mockProducts) {
    set.add(product.category)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"))
}

