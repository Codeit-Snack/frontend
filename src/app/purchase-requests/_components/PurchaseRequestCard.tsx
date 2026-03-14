"use client";

import Image from "next/image";
import type { PurchaseRequestItem } from "../_types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<PurchaseRequestItem["status"], string> = {
  pending: "승인대기",
  rejected: "구매 반려",
  approved: "승인 완료",
};

interface PurchaseRequestCardProps {
  item: PurchaseRequestItem;
  onCancelRequest: (item: PurchaseRequestItem) => void;
  className?: string;
}

export function PurchaseRequestCard({
  item,
  onCancelRequest,
  className,
}: PurchaseRequestCardProps) {
  const canCancel = item.status === "pending";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-[var(--gray-gray-100)] py-4 last:border-b-0",
        className
      )}
    >
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{item.productSummary}</p>
          <p className="text-sm text-gray-500">총 수량: {item.totalQuantity}개</p>
          {canCancel && (
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                variant="outlined"
                size="etc-sm"
                className="!h-8 !rounded-lg"
                onClick={() => onCancelRequest(item)}
              >
                요청 취소
              </Button>
            </div>
          )}
        </div>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-gray-500">주문금액</dt>
        <dd className="font-medium text-gray-900">
          {item.totalAmount.toLocaleString()}원
        </dd>
        <dt className="text-gray-500">구매요청일</dt>
        <dd className="text-gray-700">{item.requestDate}</dd>
        <dt className="text-gray-500">상태</dt>
        <dd>
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
              item.status === "pending" && "bg-[#FDF0DF] text-[#E5762C]",
              item.status === "rejected" && "bg-gray-100 text-gray-600",
              item.status === "approved" && "bg-gray-100 text-gray-700"
            )}
          >
            {STATUS_LABEL[item.status]}
          </span>
        </dd>
      </dl>
    </div>
  );
}
