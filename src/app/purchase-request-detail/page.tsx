"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { Header, CONTENT_PADDING_X } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useDevice } from "@/hooks/use-device";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { APPROVAL_INFO, DETAIL_ITEMS, REQUEST_INFO } from "./_data";

function formatPrice(value: number) {
  return `${value.toLocaleString()}원`;
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="font-[Pretendard] text-[16px] font-semibold leading-[24px] text-[var(--black-black-400,#1F1F1F)] lg:text-[20px] lg:leading-[30px] xl:text-[28px] xl:leading-[40px]">
        {label}
      </p>
      <div className="rounded-[16px] border border-[var(--gray-gray-200,#E0E0E0)] bg-white px-5 py-4 font-[Pretendard] text-[15px] font-medium leading-[24px] text-[var(--gray-gray-400,#ABABAB)] lg:px-6 lg:py-5 lg:text-[18px] lg:leading-[28px] xl:text-[28px] xl:leading-[40px]">
        {value}
      </div>
    </div>
  );
}

export default function PurchaseRequestDetailPage() {
  const device = useDevice();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const [requestOpen, setRequestOpen] = useState(true);
  const [approvalOpen, setApprovalOpen] = useState(true);

  const useAccordion = !isDesktop;
  const totalCount = useMemo(
    () => DETAIL_ITEMS.reduce((acc, cur) => acc + cur.quantity, 0),
    []
  );
  const totalPrice = useMemo(
    () => DETAIL_ITEMS.reduce((acc, cur) => acc + cur.quantity * cur.unitPrice, 0),
    []
  );

  return (
    <div className="min-h-screen background_background_400_b">
      <Header device={device} isLoggedIn role="member" cartCount={2} />

      <main className={cn(CONTENT_PADDING_X, "pb-12 pt-3.5 md:pt-10")}>
        <div className="mx-auto w-full max-w-[1680px]">
          <h1 className="mb-6 font-[Pretendard] text-[20px] font-semibold leading-[32px] text-[var(--black-black-400,#1F1F1F)] lg:text-[28px] lg:leading-[38px] xl:mb-10 xl:text-[42px] xl:leading-[52px]">
            구매 요청 내역
          </h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-10">
            <section className="order-2 space-y-4 lg:order-1">
              <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[28px] text-[var(--black-black-400,#1F1F1F)] lg:text-[24px] lg:leading-[34px] xl:text-[36px] xl:leading-[44px]">
                요청 품목
              </h2>

              <div className="rounded-[20px] border border-[var(--black-black-100,#6B6B6B)] bg-white px-4 py-4 sm:px-6 xl:px-8 xl:py-6">
                <div className="h-[360px] overflow-y-auto lg:h-[460px] xl:h-[560px]">
                  {DETAIL_ITEMS.map((item) => {
                    const rowTotal = item.quantity * item.unitPrice;
                    return (
                      <div
                        key={item.id}
                        className="border-b border-[var(--gray-gray-200,#E0E0E0)] py-4 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[10px] border border-[var(--gray-gray-200,#E0E0E0)] bg-white p-3 xl:h-[82px] xl:w-[82px]">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1 pt-1">
                            <p className="font-[Pretendard] text-[12px] font-medium leading-[18px] text-[var(--gray-gray-400,#ABABAB)] xl:text-[16px] xl:leading-[24px]">
                              {item.category}
                            </p>
                            <p className="font-[Pretendard] text-[16px] font-semibold leading-[24px] text-[var(--black-black-400,#1F1F1F)] xl:text-[28px] xl:leading-[36px]">
                              {item.name}
                            </p>
                          </div>
                          <p className="shrink-0 whitespace-nowrap pt-2 font-[Pretendard] text-[14px] font-semibold leading-[22px] text-[var(--black-black-400,#1F1F1F)] sm:text-[16px] sm:leading-[24px] xl:text-[32px] xl:leading-[42px]">
                            {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                          <p className="font-[Pretendard] text-[14px] font-medium leading-[22px] text-[var(--black-black-200,#525252)] sm:text-[16px] sm:leading-[24px] xl:text-[24px] xl:leading-[34px]">
                            수량: {item.quantity}개
                          </p>
                          <p className="whitespace-nowrap font-[Pretendard] text-[18px] font-bold leading-[26px] text-[var(--black-black-400,#1F1F1F)] sm:text-[20px] sm:leading-[28px] xl:text-[40px] xl:leading-[48px]">
                            {formatPrice(rowTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1 sm:gap-3">
                <p className="font-[Pretendard] text-[20px] font-semibold leading-[30px] text-[var(--black-black-400,#1F1F1F)] lg:text-[24px] lg:leading-[34px] xl:text-[36px] xl:leading-[44px]">
                  총 {totalCount}건
                </p>
                <p className="whitespace-nowrap font-[Pretendard] text-[34px] font-bold leading-[42px] text-[var(--primary-orange-400,#F97B22)] lg:text-[40px] lg:leading-[48px] xl:text-[56px] xl:leading-[64px]">
                  {formatPrice(totalPrice)}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outlined"
                  className="!h-14 !min-w-0 !flex-1 !rounded-[16px] !border-0 !bg-[#FFF6E9] font-[Pretendard] !text-[18px] !font-semibold !leading-[28px] !text-[var(--primary-orange-400,#F97B22)] xl:!h-[72px] xl:!text-[28px] xl:!leading-[40px]"
                >
                  목록 보기
                </Button>
                <Button
                  type="button"
                  variant="solid"
                  className="!h-14 !min-w-0 !flex-1 !rounded-[16px] font-[Pretendard] !text-[18px] !font-semibold !leading-[28px] xl:!h-[72px] xl:!text-[28px] xl:!leading-[40px]"
                >
                  장바구니 다시 담기
                </Button>
              </div>
            </section>

            <section className="order-1 space-y-6 lg:order-2 xl:space-y-8">
              <div>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between border-b border-[var(--black-black-100,#6B6B6B)] pb-3 text-left",
                    !useAccordion && "cursor-default"
                  )}
                  onClick={() => useAccordion && setRequestOpen((prev) => !prev)}
                >
                  <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[28px] text-[var(--black-black-400,#1F1F1F)] lg:text-[24px] lg:leading-[34px] xl:text-[36px] xl:leading-[44px]">
                    요청 정보
                  </h2>
                  {useAccordion && (
                    <ChevronUp
                      className={cn(
                        "h-5 w-5 text-[var(--gray-gray-400,#ABABAB)] transition-transform",
                        !requestOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>
                {(requestOpen || !useAccordion) && (
                  <div className="space-y-6 pt-4">
                    <p className="font-[Pretendard] text-[16px] font-medium leading-[24px] text-[var(--gray-gray-400,#ABABAB)] lg:text-[20px] lg:leading-[30px] xl:text-[32px] xl:leading-[42px]">
                      {REQUEST_INFO.requestDate}
                    </p>
                    <InfoField label="요청인" value={REQUEST_INFO.requester} />
                    <InfoField label="요청 메시지" value={REQUEST_INFO.requestMessage} />
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between border-b border-[var(--black-black-100,#6B6B6B)] pb-3 text-left",
                    !useAccordion && "cursor-default"
                  )}
                  onClick={() => useAccordion && setApprovalOpen((prev) => !prev)}
                >
                  <h2 className="font-[Pretendard] text-[18px] font-semibold leading-[28px] text-[var(--black-black-400,#1F1F1F)] lg:text-[24px] lg:leading-[34px] xl:text-[36px] xl:leading-[44px]">
                    승인 정보
                  </h2>
                  {useAccordion && (
                    <ChevronUp
                      className={cn(
                        "h-5 w-5 text-[var(--gray-gray-400,#ABABAB)] transition-transform",
                        !approvalOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>
                {(approvalOpen || !useAccordion) && (
                  <div className="space-y-6 pt-4">
                    <p className="font-[Pretendard] text-[16px] font-medium leading-[24px] text-[var(--gray-gray-400,#ABABAB)] lg:text-[20px] lg:leading-[30px] xl:text-[32px] xl:leading-[42px]">
                      {APPROVAL_INFO.approvalDate}
                    </p>
                    <InfoField label="담당자" value={APPROVAL_INFO.manager} />
                    <InfoField label="상태" value={APPROVAL_INFO.status} />
                    <InfoField label="결과 메시지" value={APPROVAL_INFO.resultMessage} />
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
