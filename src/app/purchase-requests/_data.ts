import type { PurchaseRequestItem } from "./_types";

const COLA_IMG = "/assets/purchase_request_details/cola.png";

export const SEED_PURCHASE_REQUESTS: PurchaseRequestItem[] = [
  {
    id: "1",
    requestDate: "2024.07.04",
    productSummary: "코카콜라 제로 외 1건",
    totalQuantity: 4,
    totalAmount: 21000,
    status: "pending",
    imageUrl: COLA_IMG,
  },
  {
    id: "2",
    requestDate: "2024.07.02",
    productSummary: "스프라이트 외 3건",
    totalQuantity: 4,
    totalAmount: 36000,
    status: "pending",
    imageUrl: COLA_IMG,
  },
  {
    id: "3",
    requestDate: "2024.07.01",
    productSummary: "비요뜨 외 9건",
    totalQuantity: 4,
    totalAmount: 45000,
    status: "rejected",
    imageUrl: COLA_IMG,
  },
  {
    id: "4",
    requestDate: "2024.06.30",
    productSummary: "환타 외 7건",
    totalQuantity: 4,
    totalAmount: 27000,
    status: "approved",
    imageUrl: COLA_IMG,
  },
  {
    id: "5",
    requestDate: "2024.06.27",
    productSummary: "컵누들 외 5건",
    totalQuantity: 4,
    totalAmount: 40000,
    status: "approved",
    imageUrl: COLA_IMG,
  },
  {
    id: "6",
    requestDate: "2024.06.20",
    productSummary: "코카콜라 외 2건",
    totalQuantity: 4,
    totalAmount: 17000,
    status: "approved",
    imageUrl: COLA_IMG,
  },
];
