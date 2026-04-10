export type PurchaseRequestSort = "latest" | "amountAsc" | "amountDesc";

export type PurchaseRequestStatus = "pending" | "rejected" | "approved";

export interface PurchaseRequestItem {
  id: string;
  requestDate: string;
  approvalDate: string;
  requester: string;
  manager: string;
  productSummary: string;
  totalQuantity: number;
  totalAmount: number;
  status: PurchaseRequestStatus;
  imageUrl?: string;
}
