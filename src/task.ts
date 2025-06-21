import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

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
    .order("created_at", { ascending: false })
    .eq("user_id", userId)
    .throwOnError();
  return data;
};

export const updateTask = async (taskId: string, task: TaskInsert) => {
  const { data } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", taskId)
    .throwOnError();
  return data;
};

export const updateTaskCompleted = async (
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

export const createTask = async (
  userId: string,
  task: Omit<TaskInsert, "user_id">
) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      ...task,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
