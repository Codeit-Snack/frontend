import { mockMembers } from "./mock-data";
import type { GetMembersParams, GetMembersResult } from "./types";

export async function getMembers(
  params: GetMembersParams = {},
): Promise<GetMembersResult> {
  const { keyword = "", page = 1, pageSize = 6 } = params;
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filtered = normalizedKeyword
    ? mockMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(normalizedKeyword) ||
          member.email.toLowerCase().includes(normalizedKeyword),
      )
    : mockMembers;

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  await new Promise((resolve) => setTimeout(resolve, 150));

  return {
    members: filtered.slice(start, end),
    totalCount,
    totalPages,
    page: currentPage,
  };
}
