export type SortOption = "latest" | "priceAsc" | "priceDesc" | "purchaseDesc"

export interface Product {
  id: number
  image: string
  category: string
  purchaseCount: number
  name: string
  price: number
}

export interface GetProductsParams {
  keyword?: string
  category?: string
  sort?: SortOption
  page?: number
  pageSize?: number
}

export interface GetProductsResult {
  products: Product[]
  totalCount: number
  totalPages: number
  page: number
}

