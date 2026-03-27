import type {
  ApprovalInfo,
  PurchaseRequestDetailItem,
  PurchaseRequestInfo,
} from "./_types";

const COLA_IMG = "/assets/purchase_request_details/cola.png";

export const DETAIL_ITEMS: PurchaseRequestDetailItem[] = [
  {
    id: "1",
    name: "코카콜라 제로",
    category: "청량 · 탄산음료",
    unitPrice: 2000,
    quantity: 4,
    imageUrl: COLA_IMG,
  },
  {
    id: "2",
    name: "코카콜라 제로",
    category: "청량 · 탄산음료",
    unitPrice: 2000,
    quantity: 4,
    imageUrl: COLA_IMG,
  },
  {
    id: "3",
    name: "코카콜라 제로",
    category: "청량 · 탄산음료",
    unitPrice: 2000,
    quantity: 4,
    imageUrl: COLA_IMG,
  },
  {
    id: "4",
    name: "코카콜라 제로",
    category: "청량 · 탄산음료",
    unitPrice: 2000,
    quantity: 4,
    imageUrl: COLA_IMG,
  },
  {
    id: "5",
    name: "코카콜라 제로",
    category: "청량 · 탄산음료",
    unitPrice: 2000,
    quantity: 4,
    imageUrl: COLA_IMG,
  },
];

export const REQUEST_INFO: PurchaseRequestInfo = {
  requestDate: "2024. 07. 20.",
  requester: "김스낵",
  requestMessage: "코카콜라 제로 인기가 많아요.\n많이 주문하면 좋을 것 같아요!",
};

export const APPROVAL_INFO: ApprovalInfo = {
  approvalDate: "2024. 07. 24.",
  manager: "김코드",
  status: "구매 반려",
  resultMessage: "다른 상품들도 더 추가하여 구매요청 부탁드립니다.",
};
