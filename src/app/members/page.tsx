"use client";

import { useState } from "react";
import { MembersHeader } from "./_components/members-header";
import { MembersDeleteAccountModal } from "./_components/members-delete-account-modal";
import { MembersEditRoleModal } from "./_components/members-edit-role-modal";
import { MembersInviteModal } from "./_components/members-invite-modal";
import { MembersPagination } from "./_components/members-pagination";
import { MembersTable } from "./_components/members-table";
import { useMembers } from "./_hooks/use-members";
import type { Member } from "./_lib/types";

export default function MembersPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [selectedDeactivateMember, setSelectedDeactivateMember] =
    useState<Member | null>(null);
  const [selectedRoleMember, setSelectedRoleMember] = useState<Member | null>(
    null
  );

  const {
    keyword,
    page,
    members,
    totalPages,
    loading,
    error,
    setKeyword,
    setPage,
    handleChangeRole,
    handleDeactivate,
  } = useMembers();

  const handleChangeKeyword = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const handleOpenDeactivateModal = (member: Member) => {
    setSelectedDeactivateMember(member);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmDeactivate = (memberId: number) => {
    handleDeactivate(memberId);
    setIsDeactivateModalOpen(false);
    setSelectedDeactivateMember(null);
  };

  const handleOpenEditRoleModal = (member: Member) => {
    setSelectedRoleMember(member);
    setIsEditRoleModalOpen(true);
  };

  const handleConfirmEditRole = (memberId: number) => {
    handleChangeRole(memberId);
    setIsEditRoleModalOpen(false);
    setSelectedRoleMember(null);
  };

  return (
    <main className="px-4 pt-0 pb-6 min-[745px]:px-8 min-[745px]:pt-0 min-[745px]:pb-10">
      <section className="w-full">
        <MembersHeader
          keyword={keyword}
          onChangeKeyword={handleChangeKeyword}
          onInvite={() => setIsInviteModalOpen(true)}
        />
        {error ? (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : (
          <MembersTable
            members={members}
            loading={loading}
            onChangeRole={handleOpenEditRoleModal}
            onDeactivate={handleOpenDeactivateModal}
          />
        )}
        <MembersPagination
          page={page}
          totalPages={totalPages}
          onChangePage={setPage}
        />
        <MembersInviteModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
        />
        <MembersDeleteAccountModal
          open={isDeactivateModalOpen}
          member={selectedDeactivateMember}
          onOpenChange={(open) => {
            setIsDeactivateModalOpen(open);
            if (!open) {
              setSelectedDeactivateMember(null);
            }
          }}
          onConfirm={handleConfirmDeactivate}
        />
        <MembersEditRoleModal
          open={isEditRoleModalOpen}
          member={selectedRoleMember}
          onOpenChange={(open) => {
            setIsEditRoleModalOpen(open);
            if (!open) {
              setSelectedRoleMember(null);
            }
          }}
          onConfirm={handleConfirmEditRole}
        />
      </section>
    </main>
  );
}
