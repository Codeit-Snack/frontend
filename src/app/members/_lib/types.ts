export type MemberRole = "super_admin" | "admin" | "user";

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
