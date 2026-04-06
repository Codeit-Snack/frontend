export type MemberRole = "super_admin" | "admin" | "user";
export type MemberRoleOption = "admin" | "member";

export interface Member {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  active: boolean;
}

export interface GetMembersParams {
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface GetMembersResult {
  members: Member[];
  totalCount: number;
  totalPages: number;
  page: number;
}

export interface InviteMemberInput {
  name: string;
  email: string;
  role: MemberRoleOption;
  organizationId?: number;
}

export interface ChangeMemberRoleInput {
  memberId: number;
  role: MemberRoleOption;
}
