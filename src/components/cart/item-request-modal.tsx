"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ensureAccessTokenFresh,
  refreshAuthTokensOnce,
} from "@/lib/auth/ensure-access-token";
import { buildCartAuthHeaders } from "@/lib/cart/auth-headers";
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
  onComplete?: (message: string) => void;
}

export default function ItemRequestModal({
  requesterName,
  items,
  totalCount,
  totalPrice,
  trigger,
  onComplete,
}: ItemRequestModalProps) {
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    if (items.length === 0) return;

    const okSession = await ensureAccessTokenFresh();
    if (!okSession) {
      console.error("구매 요청: 로그인이 만료되었습니다. 다시 로그인해 주세요.");
      return;
    }

    // POST /api/purchase-requests 본문은 백엔드 DTO에 맞게 `requestMessage`만 전송
    const payload = JSON.stringify({
      requestMessage: message.trim(),
    });

    const doPost = () => {
      const auth = buildCartAuthHeaders();
      if (!auth.Authorization) {
        return Promise.resolve(
          new Response(null, { status: 401, statusText: "Unauthorized" }),
        );
      }
      return fetch("/api/purchase-requests", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...auth,
        },
        body: payload,
      });
    };

    try {
      let res = await doPost();
      if (res.status === 401 && (await refreshAuthTokensOnce())) {
        res = await doPost();
      }
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `구매 요청 실패 (${res.status})`);
      }
    } catch (e) {
      console.error(e);
      return;
    }
    onComplete?.(message);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-[#FBF8F4]">
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
              onClick={handleConfirm}
            >
              구매 요청하기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}