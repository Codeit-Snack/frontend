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
      <p className="text_xl_semibold black_black_400_t">
        {label}
      </p>
      <div className="self-stretch rounded-[16px] border border-[var(--gray-gray-200,#E0E0E0)] background_background_400_b flex items-start px-6 py-[14px] text_xl_regular gray_gray_500_t">
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
          <h1 className="mb-6 text_3xl_semibold black_black_400_t xl:mb-10">
            구매 요청 내역
          </h1>

          <div className="grid grid-cols-1 gap-[50px] lg:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <section className="order-2 space-y-4 lg:order-1">
              <h2 className="text_2xl_bold black_black_400_t">
                요청 품목
              </h2>

              <div className="rounded-[20px] border border-[var(--black-black-100,#6B6B6B)] bg-white p-6 xl:p-10">
                <div className="-mr-6 h-[360px] overflow-y-auto pr-6 lg:h-[460px] xl:-mr-10 xl:h-[560px] xl:pr-10">
                  {DETAIL_ITEMS.map((item) => {
                    const rowTotal = item.quantity * item.unitPrice;
                    return (
                      <div
                        key={item.id}
                        className="border-b border-[var(--gray-gray-200,#E0E0E0)] py-6 first:pt-0 last:pb-0 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-[10px] border border-[var(--gray-gray-200,#E0E0E0)] background_background_400_b p-3 xl:h-[82px] xl:w-[82px]">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <p className="text_md_regular gray_gray_500_t">
                              {item.category}
                            </p>
                            <p className="text_2lg_medium black_black_400_t">
                              {item.name}
                            </p>
                          </div>
                          <p className="shrink-0 whitespace-nowrap text_2lg_semibold black_black_400_t">
                            {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-end justify-between">
                          <p className="text_lg_medium black_black_400_t">
                            수량: {item.quantity}개
                          </p>
                          <p className="whitespace-nowrap text_2xl_bold black_black_400_t">
                            {formatPrice(rowTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1 sm:gap-3">
                <p className="text_2xl_semibold black_black_400_t">
                  총 {totalCount}건
                </p>
                <p className="whitespace-nowrap text_3xl_bold primary_orange_400_t">
                  {formatPrice(totalPrice)}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  variant="outlined"
                  className="!h-14 !min-w-0 !flex-1 !rounded-[16px] !border-0 !bg-[#FFF6E9] text-center text_xl_semibold primary_orange_400_t cursor-pointer xl:!h-[72px]"
                >
                  목록 보기
                </Button>
                <Button
                  type="button"
                  variant="solid"
                  className="!h-14 !min-w-0 !flex-1 !rounded-[16px] text-center text_xl_semibold gray_gray_50_t cursor-pointer xl:!h-[72px]"
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
                  <h2 className="text_2xl_bold black_black_400_t">
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
                    <p className="text_xl_regular gray_gray_400_t">
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
                  <h2 className="text_2xl_bold black_black_400_t">
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
                    <p className="text_xl_regular gray_gray_400_t">
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
