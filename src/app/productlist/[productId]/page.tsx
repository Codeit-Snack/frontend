import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById } from "../_lib/api"
import { ProductDetailPurchaseSection } from "../_components/product-detail-purchase-section"
import { ProductListGlobalHeader } from "../_components/productlist-global-header"

interface ProductDetailPageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId: rawProductId } = await params; 
  const productId = Number(rawProductId);
  if (!Number.isFinite(productId)) {
    notFound()
  }

  const product = await getProductById(productId)
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4]">
      <ProductListGlobalHeader />

      <main className="flex-1 px-8 py-10">
        <section className="mx-auto max-w-4xl">
          <Link
            href="/productlist"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            ← 목록으로
          </Link>

          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <span className="rounded-full bg-[var(--secondary-illustration-02)] px-3 py-1 text-xs font-semibold text-[var(--primary-orange-400)]">
                    {product.purchaseCount}회 구매
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>

                <p className="mt-6 text-3xl font-extrabold text-gray-900">
                  {product.price.toLocaleString()}원
                </p>

                <ProductDetailPurchaseSection productName={product.name} unitPrice={product.price} />

                <p className="mt-6 text-xs text-gray-400">
                  목업 데이터 기반 상세입니다. 실제 연동 시 포인트·배송·장바구니 API에 맞게 교체할 수 있어요.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

