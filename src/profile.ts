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
