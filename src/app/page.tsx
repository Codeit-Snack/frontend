import Image from "next/image"
import Link from "next/link"
import { LandingHeader } from "@/components/header"

const bubbleTexts = [
  "쉽고 빠르게 구매를 요청해보세요",
  "내가 원하는 간식을, 원하는 만큼!",
  "다양한 품목도 한 눈에 파악해요",
  "관리자와 유저 모두 이용 가능해요",
]

function SpeechBubble({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center ${className}`.trim()}>
      <div className="flex h-[40px] w-fit max-w-[240px] items-center justify-center rounded-full bg-[#F97B22] px-4 py-2 md:h-[46px] md:max-w-[320px] md:px-5">
        <p className="text-center text-[10px] font-semibold whitespace-nowrap text-white md:text-sm">
          {text}
        </p>
      </div>
      <div className="h-[10px] w-[16px] rotate-180 bg-[#F97B22] [clip-path:polygon(50%_0,0_100%,100%_100%)] md:h-[12px] md:w-[18px]" />
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FDF0DF]">
      <LandingHeader
        className="absolute left-0 top-0 z-20 w-full"
        actions={[
          { href: "/login", label: "로그인" },
          { href: "/signup/super-admin", label: "기업담당자 회원가입" },
        ]}
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1920px] flex-col items-center px-6 pb-[38vh] pt-[110px] text-center md:pt-[126px] lg:pt-[160px]">
        <h1>
          <Image
            src="/assets/snack_logo.svg"
            alt="Snack"
            width={360}
            height={92}
            priority
            className="h-auto w-[180px] md:w-[260px] lg:w-[360px]"
          />
        </h1>

        <div className="mt-5 flex w-full max-w-[320px] flex-col gap-3 md:hidden">
          <Link
            href="/login"
            className="flex min-h-11 items-center justify-center rounded-full border border-[#F97B22] bg-white px-5 py-3 text-sm font-semibold text-[#F97B22] transition-colors hover:bg-[#FFF3E8]"
          >
            로그인
          </Link>
          <Link
            href="/signup/super-admin"
            className="flex min-h-11 items-center justify-center rounded-full border border-[#F97B22] bg-white px-5 py-3 text-sm font-semibold text-[#F97B22] transition-colors hover:bg-[#FFF3E8]"
          >
            관리자 회원가입
          </Link>
        </div>

        <p className="mt-5 hidden rounded-full border border-[#F97B22]/35 bg-white/60 px-5 py-3 text-sm font-semibold text-[#E5762C] md:block md:text-xl">
          흩어진 간식 구매처를 통합하고, 기수별 지출을 똑똑하게 관리하세요
        </p>

        <div className="relative mt-12 h-[132px] w-full max-w-[320px] md:hidden">
          <SpeechBubble
            text={bubbleTexts[1]}
            className="absolute left-1/2 top-0 z-20 -translate-x-[24%]"
          />
          <SpeechBubble
            text={bubbleTexts[3]}
            className="absolute left-1/2 top-[46px] z-10 -translate-x-[92%]"
          />
          <SpeechBubble
            text={bubbleTexts[2]}
            className="absolute left-1/2 top-[62px] z-10 translate-x-[12%]"
          />
          <SpeechBubble
            text={bubbleTexts[0]}
            className="absolute left-1/2 top-[98px] z-0 -translate-x-[114%]"
          />
        </div>

        <div className="mt-12 hidden w-full max-w-[760px] flex-col gap-2 px-4 md:flex xl:hidden">
          <SpeechBubble text={bubbleTexts[0]} className="self-start ml-12" />
          <SpeechBubble text={bubbleTexts[1]} className="self-end mr-[10%]" />
          <SpeechBubble text={bubbleTexts[3]} className="self-start -ml-6" />
          <SpeechBubble text={bubbleTexts[2]} className="self-end" />
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
