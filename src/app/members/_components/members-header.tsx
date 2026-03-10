"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        <Input
          variant="search"
          inputSize="sm"
          value={keyword}
          onChange={(event) => onChangeKeyword(event.target.value)}
          placeholder="이름으로 검색하세요"
          className="w-full md:w-auto md:min-w-[260px]"
        />
        <Button
          type="button"
          onClick={onInvite}
          variant="solid"
          className="h-[54px] w-full md:w-auto px-6 rounded-xl"
        >
          회원 초대하기
        </Button>
      </div>
    </header>
  );
}
