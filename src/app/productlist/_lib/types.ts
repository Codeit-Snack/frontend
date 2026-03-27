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
  /** 소분류 name. 소분류 선택 시 사용 */
  category?: string
  /** 대분류 id. 대분류만 선택 시 해당 대분류의 모든 소분류 상품 필터 */
  categoryId?: number
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

