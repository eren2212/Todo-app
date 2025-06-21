import { supabase } from "@/lib/supabase";
import { Task } from "react-native";

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

export const updateTask = async (taskId: string, task: Task) => {
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
