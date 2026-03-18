"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogField,
  DialogLabel,
  DialogReadonlyField,
  DialogItemList,
  DialogSummary,
  DialogTextarea,
  DialogFooter,
  DialogClose,
  type RequestItem,
} from "@/components/ui/dialog";

interface ItemRequestModalProps {
  requesterName: string;
  items: RequestItem[];
  totalCount: number;
  totalPrice: number;
  trigger: React.ReactNode;
}

export default function ItemRequestModal({
  requesterName,
  items,
  totalCount,
  totalPrice,
  trigger,
}: ItemRequestModalProps) {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    const newRequest = {
      id: crypto.randomUUID(),
      requestDate: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replace(/\. /g, ".").replace(".", "."),
      productSummary:
        items.length === 1
          ? items[0].name
          : `${items[0].name} 외 ${items.length - 1}건`,
      totalQuantity: totalCount,
      totalAmount: totalPrice,
      status: "pending",
      imageUrl: items[0]?.image || "",
    };

    // 구매 요청 데이터를 localStorage에 저장합니다.
    // purchase-requests/page.tsx에서 아래 코드로 읽어와 SEED_PURCHASE_REQUESTS와 합쳐주세요.
    // const stored = JSON.parse(localStorage.getItem("purchaseRequests") ?? "[]");
    // const [items, setItems] = useState([...stored, ...SEED_PURCHASE_REQUESTS]);
    const existing = JSON.parse(
      localStorage.getItem("purchaseRequests") ?? "[]"
    );
    localStorage.setItem(
      "purchaseRequests",
      JSON.stringify([newRequest, ...existing])
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>구매 요청</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogField>
            <DialogLabel>요청인</DialogLabel>
            <DialogReadonlyField>{requesterName}</DialogReadonlyField>
          </DialogField>
          <DialogField>
            <DialogLabel>요청 품목</DialogLabel>
            <DialogItemList items={items} maxVisibleItems={2} />
          </DialogField>
          <DialogSummary totalCount={totalCount} totalPrice={totalPrice} />
          <DialogField>
            <DialogLabel>요청 메시지</DialogLabel>
            <DialogTextarea
              placeholder="요청 메시지를 입력해주세요."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </DialogField>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outlined" className="flex-1 h-[50px] rounded-[12px] cursor-pointer active:scale-95 transition-transform">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="solid"
              className="flex-1 h-[50px] rounded-[12px] cursor-pointer active:scale-95 transition-transform"
            >
              구매 요청하기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}