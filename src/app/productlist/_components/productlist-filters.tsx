"use client"

import { Chip } from "@/components/ui/chip"

interface ProductListFiltersProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function ProductListFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: ProductListFiltersProps) {
  return (
    <section className="mt-6">
      <div
        className="flex flex-wrap gap-2"
        role="listbox"
        aria-label="카테고리 필터"
      >
        <Chip
          variant="user"
          selected={selectedCategory == null}
          onClick={() => onSelectCategory(null)}
        >
          전체
        </Chip>

        {categories.map((value) => (
          <Chip
            key={value}
            variant="user"
            selected={selectedCategory === value}
            onClick={() => onSelectCategory(value)}
          >
            {value}
          </Chip>
        ))}
      </div>
    </section>
  )
}

