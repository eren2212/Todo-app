import { supabase } from "@/lib/supabase";

export const onToggleComplete = async (
  taskId: string,
  isCompleted: boolean
) => {
  const { data } = await supabase
    .from("tasks")
    .update({ is_completed: isCompleted })
    .eq("id", taskId)
    .throwOnError();
  return data;
};

export const getTasks = async (userId: string) => {
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .throwOnError();
  return data;
};
