import Link from "next/link";
import { colorGroups } from "./color-data";
import { getFontTableRows } from "./font-data";
import { ColorSwatch } from "./ColorSwatch";
import { FontTable } from "./FontTable";

export const metadata = {
  title: "가이드 | Snack",
  description: "프로젝트 컬러 팔레트 — 클릭 시 클래스명 복사",
};

export default function ColorGuidePage() {
  return (
    <div className="min-h-screen background_background_100_b">
      <header className="sticky top-0 z-10 border-b line_line_200_l border-solid bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium gray_gray_400_t hover:gray_gray_300_t transition-colors"
          >
            ← 홈
          </Link>
          <h1 className="black_black_400_t text-lg font-semibold">
            가이드
          </h1>
          <span className="text-sm gray_gray_400_t"></span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="mb-8">
            <h2 className="mb-1 black_black_400_t text-lg font-semibold mb-8">
              폰트 가이드
            </h2>
           
            <FontTable rows={getFontTableRows()} />
        </section>


        <p className="mb-8 gray_gray_400_t text-sm">
          _b: 배경 · _t: 글자색 · _l: 테두리
        </p>

        <div className="flex flex-col gap-12">
          {colorGroups.map((group) => (
            <section key={group.label}>
              <h2 className="mb-4 black_black_300_t text-base font-semibold uppercase tracking-wide">
                {group.label}
              </h2>
              <div className="flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <ColorSwatch key={item.varName} item={item} />
                ))}
              </div>
            </section>
          ))}

        
        </div>
      </main>
    </div>
  );
}
