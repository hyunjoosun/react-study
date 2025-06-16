import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UserProfile } from "../types";

export function useMypage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedProfile = sessionStorage.getItem("userProfile");
    if (!storedProfile) {
      setLoading(false);
      return;
    }

    const profile = JSON.parse(storedProfile);
    setUserProfile(profile);
    setUsername(profile.username || "");
    setLoading(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userProfile");
    document.cookie =
      "authUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const handleSaveUsername = async () => {
    if (!userProfile?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", userProfile.id);

    if (error) {
      alert("닉네임 저장 실패: " + error.message);
      return;
    }

    const updatedProfile = { ...userProfile, username };
    sessionStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
    setIsEditingUsername(false);
  };

  return {
    userProfile,
    loading,
    isEditingUsername,
    username,
    setUsername,
    setIsEditingUsername,
    handleLogout,
    handleSaveUsername,
  };
}
