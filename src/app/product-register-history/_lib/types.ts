export type ProductSort = "최신순" | "낮은가격순" | "높은가격순";

export interface ProductRegistration {
  id: number;
  registeredAt: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  productLink: string;
}

export interface GetProductRegistrationsParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
  sort?: ProductSort;
}

export interface GetProductRegistrationsResult {
  items: ProductRegistration[];
  totalCount: number;
  totalPages: number;
  page: number;
}
