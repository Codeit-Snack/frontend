import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById } from "../_lib/api"
import { CONTENT_PADDING_X } from "@/components/header"
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

      <main className={`flex-1 py-6 md:py-8 lg:py-10 ${CONTENT_PADDING_X}`}>
        <section className="mx-auto max-w-4xl">
          <Link
            href="/productlist"
            className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 lg:text-sm"
          >
            ← 목록으로
          </Link>

          <div className="mx-3 mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white lg:mx-0 lg:mt-6 lg:rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
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

              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 lg:text-sm">{product.category}</p>
                  <span className="rounded-full bg-[var(--secondary-illustration-02)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--primary-orange-400)] lg:px-3 lg:py-1 lg:text-xs">
                    {product.purchaseCount}회 구매
                  </span>
                </div>

                <h1 className="mt-2 text-xl font-bold text-gray-900 lg:mt-3 lg:text-2xl">
                  {product.name}
                </h1>

                <p className="mt-4 text-2xl font-extrabold text-gray-900 lg:mt-6 lg:text-3xl">
                  {product.price.toLocaleString()}원
                </p>

                <ProductDetailPurchaseSection productName={product.name} unitPrice={product.price} />

                <p className="mt-4 text-[11px] text-gray-400 lg:mt-6 lg:text-xs">
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

