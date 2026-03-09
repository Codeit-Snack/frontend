import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById } from "../_lib/api"

interface ProductDetailPageProps {
  params: {
    productId: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = Number(params.productId)
  if (!Number.isFinite(productId)) {
    notFound()
  }

  const product = await getProductById(productId)
  if (!product) {
    notFound()
  }

  return (
    <main className="px-8 py-10">
      <section className="mx-auto max-w-4xl">
        <Link
          href="/productlist"
          className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          ← 목록으로
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-square w-full bg-gray-100">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200" />
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">{product.category}</p>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500">
                  {product.purchaseCount}회 구매
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                {product.name}
              </h1>

              <p className="mt-6 text-3xl font-extrabold text-gray-900">
                {product.price.toLocaleString()}원
              </p>

              <div className="mt-8 rounded-2xl bg-gray-50 px-5 py-4 text-sm text-gray-600">
                목업 데이터 기반 상세 페이지입니다. 실제 API 연동 시 이 영역에 추가 정보(구매처, 옵션, 재고 등)를 붙일 수 있어요.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

