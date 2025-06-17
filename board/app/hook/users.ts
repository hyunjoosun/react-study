import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "../types";

// 기본 사용자 프로필 조회
function useUserProfiles(page: number, itemsPerPage: number = 10) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    fetchUserProfiles();
  }, [page]);

  const fetchUserProfiles = async () => {
    setLoading(true);
    setError(null);

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) {
      console.error("유저 정보 불러오기 실패:", error);
      setError(error);
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  return { users, loading, error, totalCount, refetch: fetchUserProfiles };
}

// 게시글/댓글 수 조회
async function fetchUserStats(userId: string) {
  const postsPromise = supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId);

  const commentsPromise = supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("author_id", userId);

  const postsResult = await postsPromise;
  const commentsResult = await commentsPromise;

  return {
    post_count: postsResult.count || 0,
    comment_count: commentsResult.count || 0,
  };
}

export function useUsers() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  const {
    users: pagedUsers,
    loading,
    error,
    refetch,
  } = useUserProfiles(page, ITEMS_PER_PAGE);

  const [usersWithStats, setUsersWithStats] = useState<UserProfile[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (pagedUsers.length === 0) return;

    const loadStats = async () => {
      setStatsLoading(true);

      const usersData = await Promise.all(
        pagedUsers.map(async (user) => {
          const stats = await fetchUserStats(user.id);
          return { ...user, ...stats };
        })
      );

      setUsersWithStats(usersData);
      setStatsLoading(false);
    };

    loadStats();
  }, [pagedUsers]);

  const filteredUsers = usersWithStats.filter((user) => {
    const name = user.name?.toLowerCase() || "";
    const username = user.username?.toLowerCase() || "";
    const q = searchInput.toLowerCase();
    return name.includes(q) || username.includes(q);
  });

  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedFilteredUsers = filteredUsers.slice(startIdx, endIdx);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleSearch = () => {
    setPage(1);
  };

  return {
    users: usersWithStats,
    filteredUsers: paginatedFilteredUsers,
    loading: loading || statsLoading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    handleSearch,
    page,
    setPage,
    totalPages,
    totalCount: filteredUsers.length,
  };
}
