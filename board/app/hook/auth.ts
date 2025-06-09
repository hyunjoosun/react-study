import { useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  nickname?: string | null;
  title: string;
  created_at: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: AuthUser) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return { user, login, logout };
}
