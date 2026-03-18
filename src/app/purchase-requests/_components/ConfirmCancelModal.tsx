"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productSummary: string; // "코카콜라 외 1건"
  onConfirm: () => void;
}

export function ConfirmCancelModal({
  open,
  onOpenChange,
  productSummary,
  onConfirm,
}: ConfirmCancelModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-8 sm:max-w-[90vw]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex justify-center">
            <div className="relative h-[120px] w-[140px]">
              <Image
                src="/assets/purchase_request_details/dog_ic.svg"
                alt=""
                fill
                className="object-contain"
                unoptimized
              />
              <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-[#E5762C]">
                <Image
                  src="/assets/purchase_request_details/exclamation.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            구매 요청 취소
          </DialogTitle>
          <div className="mt-2 space-y-1 text-sm text-gray-600" id="cancel-modal-desc">
            <p>{productSummary} 구매 요청을 취소하시겠어요?</p>
            <p className="font-medium text-gray-700">
              구매 요청 취소 후에는 복구할 수 없어요!
            </p>
          </div>
          <DialogDescription className="sr-only">
            {productSummary} 구매 요청을 취소하시겠어요? 구매 요청 취소 후에는 복구할 수 없어요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="solid"
            className="!h-12 !min-w-[140px] !rounded-lg order-2 sm:order-1"
            onClick={handleConfirm}
          >
            취소할래요
          </Button>
          <Button
            type="button"
            variant="outlined"
            className="!h-12 !min-w-[140px] !rounded-lg order-1 sm:order-2"
            onClick={() => onOpenChange(false)}
          >
            더 생각해볼게요
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
