"use client";

import { MembersHeader } from "./_components/members-header";
import { MembersPagination } from "./_components/members-pagination";
import { MembersTable } from "./_components/members-table";
import { useMembers } from "./_hooks/use-members";

export default function MembersPage() {
  const {
    keyword,
    page,
    members,
    totalPages,
    loading,
    error,
    setKeyword,
    setPage,
    handleInvite,
    handleChangeRole,
    handleDeactivate,
  } = useMembers();

  const handleChangeKeyword = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  return (
    <main className="px-8 py-10">
      <section className="mx-auto max-w-6xl">
        <MembersHeader
          keyword={keyword}
          onChangeKeyword={handleChangeKeyword}
          onInvite={handleInvite}
        />
        {error ? (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : (
          <MembersTable
            members={members}
            loading={loading}
            onChangeRole={handleChangeRole}
            onDeactivate={handleDeactivate}
          />
        )}
        <MembersPagination
          page={page}
          totalPages={totalPages}
          onChangePage={setPage}
        />
      </section>
    </main>
  );
}
