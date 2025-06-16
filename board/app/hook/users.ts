import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "../types";

// 기본 사용자 프로필 조회
function useUserProfiles() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const fetchUserProfiles = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.error("유저 정보 불러오기 실패:", error);
      setError(error);
      setLoading(false);
      return;
    }

    setUsers(data);
    setLoading(false);
  };

  return { users, loading, error, refetch: fetchUserProfiles };
}

// 게시글/댓글 수 조회
async function fetchUserStats(userId: string) {
  const [{ count: postCount }, { count: commentCount }] = await Promise.all([
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("author_id", userId),
  ]);

  return {
    post_count: postCount || 0,
    comment_count: commentCount || 0,
  };
}

export function useUsers() {
  const { users, loading, error, refetch } = useUserProfiles();
  const [usersWithStats, setUsersWithStats] = useState<UserProfile[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (users.length === 0) return;

    const loadStats = async () => {
      setStatsLoading(true);

      const usersData = await Promise.all(
        users.map(async (user) => {
          const stats = await fetchUserStats(user.id);
          return {
            ...user,
            ...stats,
          };
        })
      );

      setUsersWithStats(usersData);
      setFilteredUsers(usersData);
      setStatsLoading(false);
    };

    loadStats();
  }, [users]);

  const handleSearch = () => {
    const lowercasedInput = searchInput.toLowerCase();
    const filtered = usersWithStats.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const username = user.username?.toLowerCase() || "";

      return name.includes(lowercasedInput) || username.includes(lowercasedInput);
    });
    setFilteredUsers(filtered);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentPageUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return {
    users: usersWithStats,
    filteredUsers: currentPageUsers,
    loading: loading || statsLoading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    handleSearch,
    page,
    setPage,
    totalPages,
  };
}
