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
            <Button variant="outlined" className="flex-1 h-[50px] rounded-[12px]">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={message.length < 10 ? "solid-disabled" : "solid"}
              className="flex-1 h-[50px] rounded-[12px]"
              disabled={message.length < 10}
            >
              구매 요청하기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}