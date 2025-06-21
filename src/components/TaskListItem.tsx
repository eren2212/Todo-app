import { Tables } from "@/types/database.types";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskCompleted } from "@/task";

export default function TaskListItem({ task }: { task: Tables<"tasks"> }) {
  const queryClient = useQueryClient();

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "work":
        return "briefcase";
      case "personal":
        return "user";
      case "health":
        return "heart";
      case "education":
        return "book";
      default:
        return "tag";
    }
  };

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: (taskId: string) =>
      updateTaskCompleted(taskId, !task.is_completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <TouchableOpacity
      className="mx-4 mb-4 bg-white rounded-2xl shadow-lg border border-purple-400"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {/* Gradient header */}
      <View className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-t-2xl" />

      <View className="p-6">
        {/* Main content */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-xl font-bold text-gray-900 mb-2 leading-tight">
              {task.title}
            </Text>
            {task.description && (
              <Text className="text-base text-gray-600 leading-relaxed">
                {task.description}
              </Text>
            )}
          </View>

          {/* Status indicator */}
          <Pressable
            className={`p-3 rounded-full ${
              task.is_completed ? "bg-green-50" : "bg-gray-50"
            }`}
            onPress={() => {
              updateTaskMutation(task.id.toString());
            }}
          >
            <Feather
              name={task.is_completed ? "check-circle" : "circle"}
              size={24}
              color={task.is_completed ? "#10b981" : "#6b7280"}
            />
          </Pressable>
        </View>

        {/* Tags and metadata */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {/* Priority badge */}
            <View
              className={`px-3 py-1.5 rounded-full border ${getPriorityColor(
                task.priority || "low"
              )}`}
            >
              <Text
                className={`text-xs font-semibold uppercase tracking-wide ${
                  getPriorityColor(task.priority || "low").split(" ")[1]
                }`}
              >
                {task.priority || "Low"}
              </Text>
            </View>

            {/* Category badge */}
            <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <Feather
                name={getCategoryIcon(task.category || "general") as any}
                size={12}
                color="#6b7280"
              />
              <Text className="text-xs font-medium text-gray-600 ml-1.5 capitalize">
                {task.category || "General"}
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-sm text-gray-500">
              {new Date(task.created_at).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
