"use client";

import Image from "next/image";
import type { PurchaseRequestItem } from "../_types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<PurchaseRequestItem["status"], string> = {
  pending: "승인 대기",
  rejected: "구매 반려",
  approved: "승인 완료",
};

interface PurchaseRequestTableProps {
  items: PurchaseRequestItem[];
  onCancelRequest: (item: PurchaseRequestItem) => void;
  className?: string;
}

export function PurchaseRequestTable({
  items,
  onCancelRequest,
  className,
}: PurchaseRequestTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-[var(--gray-gray-200)] bg-white",
        className
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--gray-gray-200)] bg-[var(--gray-gray-50)]">
            <th className="px-4 py-3 font-medium text-gray-900">구매요청일</th>
            <th className="px-4 py-3 font-medium text-gray-900">상품정보</th>
            <th className="px-4 py-3 font-medium text-gray-900">주문 금액</th>
            <th className="px-4 py-3 font-medium text-gray-900">상태</th>
            <th className="w-24 px-4 py-3 font-medium text-gray-900">비고</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const canCancel = item.status === "pending";
            return (
              <tr
                key={item.id}
                className="border-b border-[var(--gray-gray-100)] last:border-b-0"
              >
                <td className="px-4 py-3 text-gray-700">{item.requestDate}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-900">{item.productSummary}</div>
                  <div className="text-gray-500">총 수량: {item.totalQuantity}개</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {item.totalAmount.toLocaleString()}
                </td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3">
                  {canCancel ? (
                    <Button
                      type="button"
                      variant="outlined"
                      size="etc-sm"
                      className="!h-8 !rounded-lg"
                      onClick={() => onCancelRequest(item)}
                    >
                      요청 취소
                    </Button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
