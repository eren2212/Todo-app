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

export const getTasksByDate = async (userId: string, date: string) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: false })
    .throwOnError();
  return data;
};

export const getTasksGroupedByDate = async (userId: string) => {
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
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
