"use client";

import { Sort } from "@/components/ui/sort";
import type { ProductSort } from "../_lib/types";

const SORT_OPTIONS: ProductSort[] = [
  "최신순",
  "낮은가격순",
  "높은가격순",
];

interface ProductRegisterHeaderProps {
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  isSortOpen: boolean;
  onSortOpenChange: (open: boolean) => void;
}

export function ProductRegisterHeader({
  sort,
  onSortChange,
  isSortOpen,
  onSortOpenChange,
}: ProductRegisterHeaderProps) {
  return (
    <header>
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-[#37352f]">상품 등록 내역</h1>
        <div className="relative">
          <Sort
            label={sort}
            size="md"
            onClick={() => onSortOpenChange(!isSortOpen)}
            aria-expanded={isSortOpen}
            aria-haspopup="listbox"
          />
          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => onSortOpenChange(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1">
                <div
                  role="listbox"
                  className="flex flex-col rounded-2xl border border-[#E6E6E6] bg-white py-2 w-[136px] shadow-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={opt === sort}
                      className={`w-full px-3.5 py-3 text-left text-[18px] transition-colors ${
                        opt === sort
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-[#9F9F9F] hover:bg-[#F6F6F6]"
                      }`}
                      onClick={() => {
                        onSortChange(opt);
                        onSortOpenChange(false);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
