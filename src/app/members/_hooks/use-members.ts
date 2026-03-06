"use client";

import { useCallback, useEffect, useState } from "react";
import { getMembers } from "../_lib/api";
import type { Member } from "../_lib/types";

export function useMembers() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMembers({ keyword, page });
        setMembers(result.members);
        setTotalPages(result.totalPages);
      } catch {
        setError("회원 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, page]);

  const handleInvite = useCallback(() => {
    console.log("invite");
  }, []);

  const handleChangeRole = useCallback((memberId: number) => {
    console.log("change role", memberId);
  }, []);

  const handleDeactivate = useCallback((memberId: number) => {
    console.log("deactivate", memberId);
  }, []);

  return {
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
  };
}
