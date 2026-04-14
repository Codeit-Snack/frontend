"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogField,
  DialogFooter,
  DialogHeader,
  DialogInput,
  DialogLabel,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { ApiError, createCategory } from "../_lib/api"
import type { CatalogCategory } from "../_lib/types"

type Level = "main" | "sub"

interface CategoryCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  catalogRows: CatalogCategory[]
  onSuccess?: () => void
}

export function CategoryCreateModal({
  open,
  onOpenChange,
  catalogRows,
  onSuccess,
}: CategoryCreateModalProps) {
  const [level, setLevel] = useState<Level>("main")
  const [parentMainId, setParentMainId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const roots = useMemo(
    () =>
      catalogRows
        .filter((r) => r.parentId === null)
        .sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id,
        ),
    [catalogRows],
  )

  const prevOpen = useRef(false)

  useEffect(() => {
    if (open && !prevOpen.current) {
      setSubmitError(null)
      setLevel("main")
      setParentMainId(roots[0]?.id ?? null)
      setName("")
    }
    prevOpen.current = open
  }, [open, roots])

  useEffect(() => {
    if (level !== "sub" || roots.length === 0) return
    if (parentMainId != null && roots.some((r) => r.id === parentMainId)) return
    setParentMainId(roots[0].id)
  }, [level, parentMainId, roots])

  const resetAndClose = useCallback(() => {
    onOpenChange(false)
    setSubmitError(null)
    setName("")
    setLevel("main")
    setParentMainId(null)
  }, [onOpenChange])

  const handleSubmit = async () => {
    setSubmitError(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setSubmitError("카테고리 이름을 입력해주세요.")
      return
    }
    if (level === "sub") {
      if (roots.length === 0) {
        setSubmitError("소분류를 추가하려면 먼저 대분류를 만들어주세요.")
        return
      }
      if (parentMainId == null || !Number.isFinite(parentMainId)) {
        setSubmitError("대분류(부모)를 선택해주세요.")
        return
      }
    }

    setSubmitting(true)
    try {
      await createCategory({
        name: trimmed,
        parentId: level === "sub" ? parentMainId : undefined,
        isActive: true,
      })
      onSuccess?.()
      resetAndClose()
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setSubmitError("등록 권한이 없습니다. (관리자 이상 필요)")
      } else if (e instanceof ApiError) {
        setSubmitError(e.message)
      } else {
        setSubmitError(
          e instanceof Error ? e.message : "저장에 실패했습니다.",
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,90vh)] w-full max-w-[500px] overflow-y-auto p-6 lg:p-8">
        <DialogHeader>
          <DialogTitle>카테고리 추가</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {submitError ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </p>
          ) : null}

          <DialogField>
            <DialogLabel>구분</DialogLabel>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLevel("main")}
                className={cn(
                  "h-[44px] flex-1 rounded-[12px] border-2 text-sm font-medium transition-colors",
                  level === "main"
                    ? "border-[#E5762C] bg-orange-50 text-[#E5762C]"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
                )}
              >
                대분류
              </button>
              <button
                type="button"
                onClick={() => setLevel("sub")}
                disabled={roots.length === 0}
                className={cn(
                  "h-[44px] flex-1 rounded-[12px] border-2 text-sm font-medium transition-colors",
                  level === "sub"
                    ? "border-[#E5762C] bg-orange-50 text-[#E5762C]"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
                  roots.length === 0 && "cursor-not-allowed opacity-50",
                )}
              >
                소분류
              </button>
            </div>
            {roots.length === 0 ? (
              <p className="mt-2 text-xs text-gray-500">
                소분류는 대분류가 있을 때만 추가할 수 있습니다.
              </p>
            ) : null}
          </DialogField>

          {level === "sub" ? (
            <DialogField>
              <DialogLabel>부모 대분류</DialogLabel>
              <div className="relative">
                <select
                  value={parentMainId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value
                    setParentMainId(v ? Number(v) : null)
                  }}
                  className={cn(
                    "h-[50px] w-full appearance-none rounded-[12px] border border-gray-200 bg-white px-4 pr-10 text-sm focus:border-[#E5762C] focus:outline-none focus:ring-1 focus:ring-[#E5762C]",
                    parentMainId ? "text-[#37352f]" : "text-gray-400",
                  )}
                >
                  <option value="">선택</option>
                  {roots.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#E5762C]" />
              </div>
            </DialogField>
          ) : null}

          <DialogField>
            <DialogLabel>이름</DialogLabel>
            <DialogInput
              placeholder="카테고리 이름"
              value={name}
              maxLength={120}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogField>
        </DialogBody>

        <DialogFooter className="mt-8 flex gap-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outlined"
              className="h-[50px] flex-1 rounded-[12px]"
              onClick={resetAndClose}
              disabled={submitting}
            >
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="solid"
            className="h-[50px] flex-1 rounded-[12px]"
            onClick={() => void handleSubmit()}
            disabled={submitting}
          >
            추가하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
