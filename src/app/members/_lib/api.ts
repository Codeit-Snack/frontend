import type {
  ChangeMemberRoleInput,
  GetMembersParams,
  GetMembersResult,
  InviteMemberInput,
  Member,
  MemberRole,
  MemberRoleOption,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://snack-xlvk.onrender.com";
const ENV_ORGANIZATION_ID = Number(process.env.NEXT_PUBLIC_ORGANIZATION_ID);
let cachedOrganizationId: number | null = null;

function parseErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;

  const candidates = [
    (payload as { message?: unknown }).message,
    (payload as { error?: unknown }).error,
    (payload as { detail?: unknown }).detail,
  ];

  const text = candidates.find((value) => typeof value === "string");
  return text ?? fallback;
}

function getDataPayload(payload: unknown) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data?: unknown }).data ?? null;
  }

  return payload;
}

async function requestApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") ??
        localStorage.getItem("token") ??
        localStorage.getItem("authToken")
      : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = text;
    }
  }

  if (!response.ok) {
    throw new Error(parseErrorMessage(json, "요청 처리에 실패했습니다."));
  }

  return json as T;
}

function normalizeRole(role: unknown): MemberRole {
  if (typeof role !== "string") return "user";

  if (role === "super_admin" || role === "admin") return role;
  if (role === "SUPER_ADMIN") return "super_admin";
  if (role === "ADMIN") return "admin";
  return "user";
}

function toRoleEnum(role: MemberRoleOption) {
  return role === "admin" ? "ADMIN" : "MEMBER";
}

function toMember(item: unknown): Member {
  const raw = (item ?? {}) as Record<string, unknown>;

  return {
    id: Number(raw.id ?? raw.memberId ?? 0),
    name: String(raw.name ?? raw.memberName ?? raw.displayName ?? ""),
    email: String(raw.email ?? ""),
    role: normalizeRole(raw.role),
    active: Boolean(raw.active ?? true),
  };
}

function toMemberArray(payload: unknown) {
  const source = getDataPayload(payload);

  if (Array.isArray(source)) return source;

  if (source && typeof source === "object") {
    const raw = source as Record<string, unknown>;

    if (Array.isArray(raw.members)) return raw.members;
    if (Array.isArray(raw.items)) return raw.items;
    if (Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw.list)) return raw.list;
    if (raw.data && typeof raw.data === "object") {
      const nested = raw.data as Record<string, unknown>;
      if (Array.isArray(nested.members)) return nested.members;
      if (Array.isArray(nested.items)) return nested.items;
      if (Array.isArray(nested.list)) return nested.list;
    }
  }

  return [];
}

function pickNumber(values: unknown[], fallback: number) {
  const found = values.find((value) => Number.isFinite(Number(value)));
  return found !== undefined ? Number(found) : fallback;
}

async function resolveOrganizationId(explicitOrganizationId?: number) {
  if (
    explicitOrganizationId !== undefined &&
    Number.isFinite(explicitOrganizationId) &&
    explicitOrganizationId > 0
  ) {
    return explicitOrganizationId;
  }

  if (cachedOrganizationId) {
    return cachedOrganizationId;
  }

  if (Number.isFinite(ENV_ORGANIZATION_ID) && ENV_ORGANIZATION_ID > 0) {
    cachedOrganizationId = ENV_ORGANIZATION_ID;
    return ENV_ORGANIZATION_ID;
  }

  const me = await requestApi<unknown>("/api/organizations/me");
  const meData = getDataPayload(me);
  if (meData && typeof meData === "object") {
    const record = meData as Record<string, unknown>;
    const organization = record.organization as Record<string, unknown> | undefined;
    const id = Number(record.id ?? organization?.id);
    if (Number.isFinite(id) && id > 0) {
      cachedOrganizationId = id;
      return id;
    }
  }

  throw new Error("조직 정보를 찾을 수 없습니다. organizationId를 확인해주세요.");
}

export async function getMembers(
  params: GetMembersParams = {},
): Promise<GetMembersResult> {
  const { keyword = "", page = 1, pageSize = 6 } = params;
  const query = new URLSearchParams({
    keyword,
    page: String(page),
    pageSize: String(pageSize),
  });

  const payload = await requestApi<unknown>(
    `/api/organizations/members?${query.toString()}`,
  );

  const rawMembers = toMemberArray(payload);
  const members = rawMembers.map(toMember).filter((member) => member.id > 0);
  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredMembers = normalizedKeyword
    ? members.filter(
        (member) =>
          member.name.toLowerCase().includes(normalizedKeyword) ||
          member.email.toLowerCase().includes(normalizedKeyword),
      )
    : members;

  const dataPayload = getDataPayload(payload);
  const payloadRecord =
    dataPayload && typeof dataPayload === "object"
      ? (dataPayload as Record<string, unknown>)
      : {};
  const totalCount = pickNumber(
    [
      payloadRecord.totalCount,
      payloadRecord.total,
      payloadRecord.count,
      filteredMembers.length,
    ],
    filteredMembers.length,
  );
  const totalPages = Math.max(
    1,
    pickNumber(
      [
        payloadRecord.totalPages,
        payloadRecord.pageCount,
        Math.ceil(totalCount / pageSize),
      ],
      1,
    ),
  );
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pagedMembers =
    Array.isArray(dataPayload) || !("totalPages" in payloadRecord)
      ? filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : filteredMembers;

  return {
    members: pagedMembers,
    totalCount,
    totalPages,
    page: currentPage,
  };
}

export async function inviteMember(input: InviteMemberInput) {
  const organizationId = await resolveOrganizationId(input.organizationId);

  await requestApi(`/api/invitations/organizations/${organizationId}/invite`, {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      inviteeName: input.name,
      roleToGrant: toRoleEnum(input.role),
    }),
  });
}

export async function deactivateMember(memberId: number) {
  await requestApi(`/api/organizations/members/${memberId}/deactivate`, {
    method: "PATCH",
  });
}

export async function changeMemberRole(input: ChangeMemberRoleInput) {
  await requestApi(`/api/organizations/members/${input.memberId}/role`, {
    method: "PATCH",
    body: JSON.stringify({
      role: toRoleEnum(input.role),
    }),
  });
}
