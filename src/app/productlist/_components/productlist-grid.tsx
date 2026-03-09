"use client"

import Link from "next/link"
import { ProductCard } from "@/components/ui/card"
import type { Product } from "../_lib/types"

interface ProductListGridProps {
  products: Product[]
  loading?: boolean
}

export function ProductListGrid({ products, loading = false }: ProductListGridProps) {
  return (
    <section className="mt-6">
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-sm text-gray-400">
          상품 정보를 불러오는 중입니다.
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-sm text-gray-400">
          조회된 상품이 없습니다.
        </div>
      ) : (
        <div className="flex flex-wrap justify-start gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/productlist/${product.id}`}
              className="transition-transform hover:-translate-y-0.5"
            >
              <ProductCard
                image={product.image}
                category={product.category}
                purchaseCount={product.purchaseCount}
                name={product.name}
                price={product.price}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

