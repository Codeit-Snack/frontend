"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeactivateMember {
  id: number;
  name: string;
  email: string;
}

interface MembersDeleteAccountModalProps {
  open: boolean;
  member: DeactivateMember | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (memberId: number) => void;
}

export function MembersDeleteAccountModal({
  open,
  member,
  onOpenChange,
  onConfirm,
}: MembersDeleteAccountModalProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] text-center">
        <DialogHeader className="sr-only">
          <DialogTitle>계정 탈퇴</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center pt-4">
          <img
            src="/assets/puppyworng.svg"
            alt="계정 탈퇴"
            className="mb-4 h-[120px] w-[120px]"
          />

          <h2 className="mb-3 text-xl font-bold text-gray-900">계정 탈퇴</h2>

          <p className="mb-6 text-sm text-gray-600">
            {member.name}(<span className="text-[#E5762C]">{member.email}</span>)
            님의 계정을 탈퇴시킬까요?
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outlined"
              className="h-[50px] flex-1 rounded-[12px] border-[#FDF0DF] bg-[#FDF0DF] hover:bg-[#fce8cf]"
            >
              더 생각해볼게요
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="solid"
              className="h-[50px] flex-1 rounded-[12px]"
              onClick={() => onConfirm(member.id)}
            >
              탈퇴시키기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
