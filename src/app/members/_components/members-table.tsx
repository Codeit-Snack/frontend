import type { Member } from "../_lib/types";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";

interface MembersTableProps {
  members: Member[];
  loading?: boolean;
  onChangeRole: (memberId: number) => void;
  onDeactivate: (memberId: number) => void;
}

function roleLabel(role: Member["role"]) {
  if (role === "super_admin") {
    return "최고 관리자";
  }
  return role === "admin" ? "관리자" : "일반";
}

export function MembersTable({
  members,
  loading = false,
  onChangeRole,
  onDeactivate,
}: MembersTableProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-500">
            <th className="px-6 py-4 font-medium">이름</th>
            <th className="px-6 py-4 font-medium">메일</th>
            <th className="px-6 py-4 font-medium">권한</th>
            <th className="px-6 py-4 font-medium">비고</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="px-6 py-8 text-sm text-gray-400" colSpan={4}>
                회원 정보를 불러오는 중입니다.
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr>
              <td className="px-6 py-8 text-sm text-gray-400" colSpan={4}>
                조회된 회원이 없습니다.
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id} className="border-t border-gray-100 text-sm">
                <td className="px-6 py-4 text-gray-700">{member.name}</td>
                <td className="px-6 py-4 text-gray-500">{member.email}</td>
                <td className="px-6 py-4">
                  <Chip
                    variant="user"
                    selected={member.role === "super_admin" || member.role === "admin"}
                  >
                    {roleLabel(member.role)}
                  </Chip>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => onDeactivate(member.id)}
                      variant="etc"
                      size="etc-sm"
                      className="rounded-lg font-normal"
                    >
                      계정 탈퇴
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onChangeRole(member.id)}
                      variant="solid"
                      size="etc-sm"
                      className="rounded-lg font-normal"
                    >
                      권한 변경
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
