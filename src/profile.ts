import { supabase } from "@/lib/supabase";

export const getProfile = async (userId: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()
    .throwOnError();
  return data;
};

export const updateProfile = async (userId: string, profile: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", userId)
    .throwOnError();
  return data;
};
