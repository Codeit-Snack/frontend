import Image from "next/image"
import Link from "next/link"

const bubbleTexts = [
  "쉽고 빠르게 구매를 요청해보세요",
  "내가 원하는 간식을, 원하는 만큼",
  "다양한 품목도 한눈에 파악해요",
  "관리자와 유저 모두 이용 가능해요",
]

function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[62px] w-full max-w-[330px] items-center justify-center rounded-[100px] bg-[#F97B22] px-6 py-4 md:h-[68px] md:max-w-[360px] md:px-7">
        <p className="text-center text-xs font-semibold whitespace-nowrap text-white md:text-base">
          {text}
        </p>
      </div>
      <div className="h-[18px] w-[24px] rotate-180 bg-[#F97B22] [clip-path:polygon(50%_0,0_100%,100%_100%)] md:h-[22px] md:w-[28px]" />
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FDF0DF]">
      <header className="absolute left-0 top-0 z-20 h-[54px] w-full bg-[#F97B22] md:h-[64px] lg:h-[88px]">
        <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between px-6 md:px-12 xl:px-[120px]">
          <span className="font-[var(--font-snack-logo)] text-[24px] font-extrabold text-white">
            Snack
          </span>

          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-white transition-opacity hover:opacity-80 md:text-sm"
            >
              로그인
            </Link>
            <Link
              href="/signup/super-admin"
              className="text-xs font-semibold text-white transition-opacity hover:opacity-80 md:text-sm"
            >
              기업담당자 회원가입
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center px-6 pb-[42vh] pt-[110px] text-center md:pt-[126px] lg:pt-[160px]">
        <h1 className="font-[var(--font-snack-logo)] text-[56px] font-extrabold leading-none text-[#F97B22] md:text-[88px]">
          Snack
        </h1>
        <p className="mt-5 rounded-full border border-[#F97B22]/35 bg-white/60 px-5 py-3 text-sm font-semibold text-[#E5762C] md:text-xl">
          흩어진 간식 구매처를 통합하고, 기수별 지출을 똑똑하게 관리하세요
        </p>

        <div className="mt-12 grid w-full max-w-[860px] grid-cols-1 gap-6 sm:grid-cols-2 xl:hidden">
          <SpeechBubble text={bubbleTexts[0]} />
          <SpeechBubble text={bubbleTexts[2]} />
          <SpeechBubble text={bubbleTexts[1]} />
          <SpeechBubble text={bubbleTexts[3]} />
        </div>

        <div className="pointer-events-none absolute inset-0 hidden xl:block">
          <div className="absolute left-[10%] top-[43%]">
            <SpeechBubble text={bubbleTexts[0]} />
          </div>
          <div className="absolute left-[3%] top-[60%]">
            <SpeechBubble text={bubbleTexts[1]} />
          </div>
          <div className="absolute right-[10%] top-[43%]">
            <SpeechBubble text={bubbleTexts[2]} />
          </div>
          <div className="absolute right-[3%] top-[60%]">
            <SpeechBubble text={bubbleTexts[3]} />
          </div>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50vh]">
        <Image
          src="/assets/landing-bd.png"
          alt="Snack 랜딩 강아지 이미지"
          fill
          priority
          className="object-contain object-bottom mix-blend-multiply"
        />
      </div>
    </main>
  )
}
