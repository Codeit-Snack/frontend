"use client";

interface MembersHeaderProps {
  keyword: string;
  onChangeKeyword: (value: string) => void;
  onInvite: () => void;
}

export function MembersHeader({
  keyword,
  onChangeKeyword,
  onInvite,
}: MembersHeaderProps) {
  return (
    <header>
      <h1 className="text-3xl font-bold text-[#37352f]">회원 관리</h1>
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <input
          className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-orange-400 md:max-w-[360px]"
          value={keyword}
          onChange={(event) => onChangeKeyword(event.target.value)}
          placeholder="이름으로 검색하세요"
        />
        <button
          type="button"
          onClick={onInvite}
          className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          회원 초대하기
        </button>
      </div>
    </header>
  );
}
