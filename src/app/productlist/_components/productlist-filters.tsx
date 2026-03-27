"use client"

import type { Category, SubCategory } from "@/types/category"
import { cn } from "@/lib/utils"

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
    <section className="mt-8 flex flex-col gap-6">
      {/* 1행: 대분류 */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-gray-100 pb-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            "relative pb-2 text-lg font-medium transition-colors",
            isAllSelected ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
          )}
        >
          전체
          {isAllSelected && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500" />
          )}
        </button>

        {categories.map((c) => {
          const isSelected = selectedCategoryId === c.id
          return (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={cn(
                "relative pb-2 text-lg font-medium transition-colors",
                isSelected ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {c.name}
              {isSelected && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-500" />
              )}
            </button>
          )
        })}
      </div>

      {/* 2행: 소분류 */}
      {selectedCategoryId !== null && subCategories.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <button
            onClick={() => onSelectSubCategory(null)}
            className={cn(
              "rounded-full px-4 py-1 text-sm transition-all",
              selectedSubCategoryId === null
                ? "bg-orange-50 text-orange-600 font-semibold"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            전체보기
          </button>

          {subCategories.map((s) => {
            const isSelected = selectedSubCategoryId === s.id
            return (
              <button
                key={s.id}
                onClick={() => onSelectSubCategory(s.id)}
                className={cn(
                  "rounded-full px-4 py-1 text-sm transition-all",
                  isSelected
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                {s.name}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
