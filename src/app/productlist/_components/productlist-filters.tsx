"use client"

import { Chip } from "@/components/ui/chip"
import type { Category, SubCategory } from "@/types/category"

interface ProductListFiltersProps {
  categories: Category[]
  subCategories: SubCategory[]
  selectedCategoryId: number | null
  selectedSubCategoryId: number | null
  onSelectCategory: (categoryId: number | null) => void
  onSelectSubCategory: (subCategoryId: number | null) => void
}

export function ProductListFilters({
  categories,
  subCategories,
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectCategory,
  onSelectSubCategory,
}: ProductListFiltersProps) {
  const isAllSelected = selectedCategoryId === null

  return (
    <section className="mt-6 flex flex-col gap-4">
      {/* 1행: 전체 + 대분류 */}
      <div
        className="flex flex-wrap gap-2"
        role="listbox"
        aria-label="대분류 카테고리 필터"
      >
        <Chip
          variant="user"
          selected={isAllSelected}
          onClick={() => onSelectCategory(null)}
        >
          전체
        </Chip>

        {categories.map((c) => (
          <Chip
            key={c.id}
            variant="user"
            selected={selectedCategoryId === c.id}
            onClick={() => onSelectCategory(c.id)}
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {/* 2행: 대분류 선택 시 소분류 Chip */}
      {selectedCategoryId !== null && subCategories.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          role="listbox"
          aria-label="소분류 카테고리 필터"
        >
          <Chip
            variant="user"
            selected={selectedSubCategoryId === null}
            onClick={() => onSelectSubCategory(null)}
          >
            전체
          </Chip>

          {subCategories.map((s) => (
            <Chip
              key={s.id}
              variant="user"
              selected={selectedSubCategoryId === s.id}
              onClick={() => onSelectSubCategory(s.id)}
            >
              {s.name}
            </Chip>
          ))}
        </div>
      )}
    </section>
  )
}
