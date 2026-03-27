"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Sort } from "@/components/ui/sort"
import type { SortOption } from "../_lib/types"

type SortOptionItem = { value: SortOption; label: string }

interface ProductListHeaderProps {
  keyword: string
  onChangeKeyword: (value: string) => void
  sortLabel: string
  sortOptions: readonly SortOptionItem[]
  selectedSort: SortOption
  onSelectSort: (value: SortOption) => void
}

export function ProductListHeader({
  keyword,
  onChangeKeyword,
  sortLabel,
  sortOptions,
  selectedSort,
  onSelectSort,
}: ProductListHeaderProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (!containerRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    window.addEventListener("mousedown", handlePointerDown)
    return () => window.removeEventListener("mousedown", handlePointerDown)
  }, [open])

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-bold text-[#37352f]">상품 리스트</h1>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          variant="search"
          inputSize="sm"
          value={keyword}
          onChange={(event) => onChangeKeyword(event.target.value)}
          placeholder="상품명으로 검색하세요"
        />

        <div ref={containerRef} className="relative self-end md:self-auto">
          <Sort
            size="sm"
            label={sortLabel}
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="menu"
          />

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-10 mt-2 w-[180px] overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white py-2 text-[#9F9F9F] shadow-sm"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSelectSort(option.value)
                    setOpen(false)
                  }}
                  className={`w-full whitespace-nowrap px-3 py-2 text-left text-[14px] leading-tight transition-colors hover:bg-[#F6F6F6] ${
                    option.value === selectedSort
                      ? "bg-[#F6F6F6] font-semibold text-[#37352f]"
                      : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

