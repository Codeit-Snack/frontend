/** 정렬: 최신순 | 낮은금액순 | 높은금액순 */
export type PurchaseRequestSort = "latest" | "amountAsc" | "amountDesc";

/** 상태: 승인 대기 | 구매 반려 | 승인 완료 */
export type PurchaseRequestStatus = "pending" | "rejected" | "approved";

export interface PurchaseRequestItem {
  id: string;
  requestDate: string;
  requester: string;
  productSummary: string;
  totalQuantity: number;
  totalAmount: number;
  status: PurchaseRequestStatus;
  imageUrl?: string;
}
