"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  ApiError,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../_lib/api"
import type { CatalogCategory } from "../_lib/types"

type Level = "main" | "sub"

type ListRow = { row: CatalogCategory; depth: 0 | 1 }

interface CategoryManageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  catalogRows: CatalogCategory[]
  onSuccess?: () => void
}

function buildListRows(rows: CatalogCategory[]): ListRow[] {
  const roots = rows
    .filter((r) => r.parentId === null)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id)
  const out: ListRow[] = []
  for (const r of roots) {
    out.push({ row: r, depth: 0 })
    const subs = rows
      .filter((c) => c.parentId === r.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id)
    for (const s of subs) {
      out.push({ row: s, depth: 1 })
    }
  }
  return out
}

export function CategoryManageModal({
  open,
  onOpenChange,
  catalogRows,
  onSuccess,
}: CategoryManageModalProps) {
  const [level, setLevel] = useState<Level>("main")
  const [parentMainId, setParentMainId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editParentId, setEditParentId] = useState<number | null>(null)
  const [editSortOrder, setEditSortOrder] = useState("")
  const [editIsActive, setEditIsActive] = useState(true)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [manageError, setManageError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const roots = useMemo(
    () =>
      catalogRows
        .filter((r) => r.parentId === null)
        .sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id,
        ),
    [catalogRows],
  )

  const listRows = useMemo(() => buildListRows(catalogRows), [catalogRows])

  const parentOptionsForEdit = useMemo(() => {
    if (editingId == null) return []
    return roots.filter((r) => r.id !== editingId)
  }, [roots, editingId])

  const prevOpen = useRef(false)

  const resetAddForm = useCallback(() => {
    setSubmitError(null)
    setLevel("main")
    setParentMainId(roots[0]?.id ?? null)
    setName("")
  }, [roots])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditName("")
    setEditParentId(null)
    setEditSortOrder("")
    setEditIsActive(true)
    setManageError(null)
  }, [])

  useEffect(() => {
    if (open && !prevOpen.current) {
      resetAddForm()
      cancelEdit()
    }
    prevOpen.current = open
  }, [open, resetAddForm, cancelEdit])

  useEffect(() => {
    if (level !== "sub" || roots.length === 0) return
    if (parentMainId != null && roots.some((r) => r.id === parentMainId)) return
    setParentMainId(roots[0].id)
  }, [level, parentMainId, roots])

  const resetAndClose = useCallback(() => {
    onOpenChange(false)
    resetAddForm()
    cancelEdit()
  }, [onOpenChange, resetAddForm, cancelEdit])

  const startEdit = useCallback(
    (row: CatalogCategory) => {
      setManageError(null)
      setSubmitError(null)
      setEditingId(row.id)
      setEditName(row.name)
      setEditParentId(row.parentId)
      setEditSortOrder(String(row.sortOrder ?? 0))
      setEditIsActive(row.isActive ?? true)
    },
    [],
  )

  const handleAdd = async () => {
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
      resetAddForm()
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

  const handleSaveEdit = async () => {
    if (editingId == null) return
    setManageError(null)
    const trimmed = editName.trim()
    if (!trimmed) {
      setManageError("카테고리 이름을 입력해주세요.")
      return
    }
    const soRaw = editSortOrder.trim()
    const sortOrder =
      soRaw === "" || !Number.isFinite(Number(soRaw))
        ? 0
        : Math.max(0, Math.floor(Number(soRaw)))

    setEditSubmitting(true)
    try {
      await updateCategory(editingId, {
        name: trimmed,
        parentId: editParentId,
        sortOrder,
        isActive: editIsActive,
      })
      onSuccess?.()
      cancelEdit()
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setManageError("수정 권한이 없습니다. (관리자 이상 필요)")
      } else if (e instanceof ApiError) {
        setManageError(e.message)
      } else {
        setManageError(
          e instanceof Error ? e.message : "저장에 실패했습니다.",
        )
      }
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDelete = async (row: CatalogCategory) => {
    if (
      !window.confirm(
        `"${row.name}" 카테고리를 삭제할까요?\n하위 분류나 연결된 상품이 있으면 삭제할 수 없습니다.`,
      )
    ) {
      return
    }
    setManageError(null)
    setDeletingId(row.id)
    try {
      await deleteCategory(row.id)
      if (editingId === row.id) cancelEdit()
      onSuccess?.()
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setManageError("삭제 권한이 없습니다. (관리자 이상 필요)")
      } else if (e instanceof ApiError && e.status === 409) {
        setManageError(
          e.message ||
            "하위 카테고리가 있거나 연결된 상품이 있어 삭제할 수 없습니다.",
        )
      } else if (e instanceof ApiError) {
        setManageError(e.message)
      } else {
        setManageError(
          e instanceof Error ? e.message : "삭제에 실패했습니다.",
        )
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,90vh)] w-full max-w-[560px] overflow-y-auto p-6 lg:p-8">
        <DialogHeader>
          <DialogTitle>카테고리 관리</DialogTitle>
        </DialogHeader>

        <DialogBody className="gap-8">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-[#37352f]">
              새 카테고리 추가
            </h3>
            {submitError ? (
              <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {submitError}
              </p>
            ) : null}

            <div className="space-y-4">
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

              <Button
                type="button"
                variant="solid"
                className="h-[50px] w-full rounded-[12px]"
                onClick={() => void handleAdd()}
                disabled={
                  submitting || editSubmitting || deletingId !== null
                }
              >
                추가하기
              </Button>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold text-[#37352f]">
              등록된 카테고리
            </h3>
            {manageError ? (
              <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {manageError}
              </p>
            ) : null}

            {listRows.length === 0 ? (
              <p className="text-sm text-gray-500">
                등록된 카테고리가 없습니다.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-[12px] border border-gray-200">
                {listRows.map(({ row, depth }) => (
                  <li key={row.id}>
                    <div
                      className={cn(
                        "flex flex-wrap items-center justify-between gap-2 px-3 py-2.5",
                        depth === 1 && "bg-gray-50/80 pl-8",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-[#37352f]">
                          {row.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {row.parentId == null ? "대분류" : "소분류"}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          className="text-sm font-medium text-[#E5762C] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => startEdit(row)}
                          disabled={
                            editSubmitting ||
                            deletingId !== null ||
                            (editingId !== null && editingId !== row.id)
                          }
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => void handleDelete(row)}
                          disabled={
                            editSubmitting ||
                            deletingId !== null ||
                            editingId !== null
                          }
                        >
                          {deletingId === row.id ? "삭제 중…" : "삭제"}
                        </button>
                      </div>
                    </div>

                    {editingId === row.id ? (
                      <div className="space-y-3 border-t border-gray-100 bg-orange-50/40 px-3 py-3">
                        <DialogField>
                          <DialogLabel>이름</DialogLabel>
                          <DialogInput
                            value={editName}
                            maxLength={120}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </DialogField>
                        <DialogField>
                          <DialogLabel>부모 (대분류)</DialogLabel>
                          <div className="relative">
                            <select
                              value={
                                editParentId == null ? "" : String(editParentId)
                              }
                              onChange={(e) => {
                                const v = e.target.value
                                setEditParentId(v ? Number(v) : null)
                              }}
                              className="h-[50px] w-full appearance-none rounded-[12px] border border-gray-200 bg-white px-4 pr-10 text-sm focus:border-[#E5762C] focus:outline-none focus:ring-1 focus:ring-[#E5762C]"
                            >
                              <option value="">최상위 (대분류)</option>
                              {parentOptionsForEdit.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#E5762C]" />
                          </div>
                        </DialogField>
                        <DialogField>
                          <DialogLabel>정렬 순서</DialogLabel>
                          <DialogInput
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={editSortOrder}
                            onChange={(e) => setEditSortOrder(e.target.value)}
                          />
                        </DialogField>
                        <Checkbox
                          variant="checkbox02"
                          checkboxSize="sm"
                          checked={editIsActive}
                          onChange={(e) =>
                            setEditIsActive(e.target.checked)
                          }
                          label="활성"
                        />
                        <div className="flex gap-2 pt-1">
                          <Button
                            type="button"
                            variant="outlined"
                            className="h-10 flex-1 rounded-[12px]"
                            onClick={cancelEdit}
                            disabled={editSubmitting}
                          >
                            취소
                          </Button>
                          <Button
                            type="button"
                            variant="solid"
                            className="h-10 flex-1 rounded-[12px]"
                            onClick={() => void handleSaveEdit()}
                            disabled={editSubmitting}
                          >
                            저장
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </DialogBody>

        <DialogFooter className="mt-6 flex gap-3 border-t border-gray-100 pt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outlined"
              className="h-[50px] flex-1 rounded-[12px]"
              onClick={resetAndClose}
              disabled={submitting || editSubmitting || deletingId !== null}
            >
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
