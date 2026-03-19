"use client"

import { useState } from "react"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogField,
  DialogFooter,
  DialogHeader,
  DialogImageUpload,
  DialogInput,
  DialogLabel,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CATEGORIES, getSubCategoriesByCategoryId } from "@/data/categories"
import { ChevronDown } from "lucide-react"

interface ProductRegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CategorySelect({
  selectedMainId,
  selectedSubId,
  onMainChange,
  onSubChange,
}: {
  selectedMainId: number | null
  selectedSubId: number | null
  onMainChange: (id: number | null) => void
  onSubChange: (id: number | null) => void
}) {
  const subCategories = selectedMainId
    ? getSubCategoriesByCategoryId(selectedMainId)
    : []

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <select
          value={selectedMainId ?? ""}
          onChange={(e) => {
            const val = e.target.value
            onMainChange(val ? Number(val) : null)
            onSubChange(null)
          }}
          className={`h-[50px] w-full appearance-none rounded-[12px] border border-gray-200 bg-white px-4 pr-10 text-sm focus:border-[#E5762C] focus:outline-none focus:ring-1 focus:ring-[#E5762C] ${selectedMainId ? "text-[#E5762C]" : "text-gray-400"}`}
        >
          <option value="">대분류</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#E5762C]" />
      </div>
      <div className="relative flex-1">
        <select
          value={selectedSubId ?? ""}
          onChange={(e) => {
            const val = e.target.value
            onSubChange(val ? Number(val) : null)
          }}
          disabled={!selectedMainId}
          className={`h-[50px] w-full appearance-none rounded-[12px] border border-gray-200 bg-white px-4 pr-10 text-sm focus:border-[#E5762C] focus:outline-none focus:ring-1 focus:ring-[#E5762C] disabled:opacity-50 ${selectedSubId ? "text-[#E5762C]" : "text-gray-400"}`}
        >
          <option value="">소분류</option>
          {subCategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#E5762C]" />
      </div>
    </div>
  )
}

export function ProductRegisterModal({ open, onOpenChange }: ProductRegisterModalProps) {
  const [mainCategoryId, setMainCategoryId] = useState<number | null>(null)
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null)

  const handleClose = () => {
    onOpenChange(false)
    setMainCategoryId(null)
    setSubCategoryId(null)
  }

  const handleSubmit = () => {
    // API 연동 시 여기에서 등록 처리
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-8 sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <DialogField>
            <DialogLabel>상품명</DialogLabel>
            <DialogInput placeholder="상품명을 입력해주세요." />
          </DialogField>

          <DialogField>
            <DialogLabel>카테고리</DialogLabel>
            <CategorySelect
              selectedMainId={mainCategoryId}
              selectedSubId={subCategoryId}
              onMainChange={setMainCategoryId}
              onSubChange={setSubCategoryId}
            />
          </DialogField>

          <DialogField>
            <DialogLabel>가격</DialogLabel>
            <DialogInput placeholder="가격을 입력해주세요." type="number" />
          </DialogField>

          <DialogField>
            <DialogLabel>상품 이미지</DialogLabel>
            <DialogImageUpload />
          </DialogField>

          <DialogField>
            <DialogLabel>제품링크</DialogLabel>
            <DialogInput placeholder="링크를 입력해주세요." />
          </DialogField>
        </DialogBody>

        <DialogFooter className="mt-8 flex gap-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outlined"
              className="h-[50px] flex-1 rounded-[12px]"
              onClick={handleClose}
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="solid"
            className="h-[50px] flex-1 rounded-[12px]"
            onClick={handleSubmit}
          >
            등록하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
