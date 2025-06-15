import { View, Text, TouchableOpacity } from "react-native";
import { Task, TaskPriority, TaskCategory } from "@/types";

interface TaskListItemProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onPress?: (task: Task) => void;
}

export default function TaskListItem({
  task,
  onToggleComplete,
  onPress,
}: TaskListItemProps) {
  const getPriorityGradient = (priority?: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High:
        return "bg-red-500";
      case TaskPriority.Medium:
        return "bg-amber-500";
      case TaskPriority.Low:
        return "bg-emerald-500";
      default:
        return "bg-slate-400";
    }
  };

  const getCategoryStyle = (category?: TaskCategory) => {
    switch (category) {
      case TaskCategory.Work:
        return {
          bg: "from-blue-50 to-indigo-50",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      case TaskCategory.Personal:
        return {
          bg: "from-purple-50 to-violet-50",
          text: "text-purple-700",
          border: "border-purple-200",
        };
      case TaskCategory.Shopping:
        return {
          bg: "from-pink-50 to-rose-50",
          text: "text-pink-700",
          border: "border-pink-200",
        };
      case TaskCategory.Health:
        return {
          bg: "from-emerald-50 to-green-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
        };
      case TaskCategory.Finance:
        return {
          bg: "from-yellow-50 to-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
        };
      case TaskCategory.Learning:
        return {
          bg: "from-indigo-50 to-blue-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
        };
      case TaskCategory.Other:
        return {
          bg: "from-gray-50 to-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
        };
      default:
        return {
          bg: "from-gray-50 to-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
        };
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const taskDate = new Date(date);
    const diffTime = taskDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `${diffDays} days remaining`;
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;
  const categoryStyle = getCategoryStyle(task.category);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(task)}
      className={`relative bg-gradient-to-br from-white via-gray-50 to-slate-50  rounded-2xl p-6 mb-4 shadow-lg shadow-gray-200/50 border-2 border-purple-500 ${
        task.isCompleted ? "opacity-75" : ""
      }`}
      style={{
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
      }}
      activeOpacity={0.95}
    >
      <View className="flex-row items-start justify-between">
        {/* Left side - Checkbox and content */}
        <View className="flex-row flex-1">
          {/* Premium Checkbox */}
          <TouchableOpacity
            onPress={() => onToggleComplete?.(task.id)}
            className={`w-7 h-7 rounded-xl border-2 mr-4 mt-1 items-center justify-center shadow-sm ${
              task.isCompleted
                ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-500 shadow-emerald-200"
                : "border-gray-300 bg-white shadow-gray-100"
            }`}
            style={{
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            {task.isCompleted && (
              <Text className="text-white text-sm font-bold">✓</Text>
            )}
          </TouchableOpacity>

          {/* Task Content */}
          <View className="flex-1">
            {/* Title with enhanced typography */}
            <Text
              className={`text-lg font-bold mb-2 leading-6 ${
                task.isCompleted
                  ? "line-through text-gray-500"
                  : "text-gray-900"
              }`}
              style={{ letterSpacing: -0.5 }}
            >
              {task.title}
            </Text>

            {/* Description with better styling */}
            {task.description && (
              <Text
                className={`text-sm mb-4 leading-5 ${
                  task.isCompleted ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ lineHeight: 20 }}
              >
                {task.description}
              </Text>
            )}

            {/* Enhanced Tags Row */}
            <View className="flex-row items-center flex-wrap gap-3">
              {/* Premium Category Badge */}
              {task.category && (
                <View
                  className={`px-3 py-2 rounded-xl  ${categoryStyle.border} border shadow-sm`}
                  style={{
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                  }}
                >
                  <Text
                    className={`text-xs font-semibold ${categoryStyle.text}`}
                  >
                    {task.category}
                  </Text>
                </View>
              )}

              {/* Premium Due Date Badge */}
              {task.dueDate && (
                <View
                  className={`px-3 py-2 rounded-xl border shadow-sm ${
                    isOverdue
                      ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                  }`}
                  style={{
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                  }}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isOverdue ? "text-red-700" : "text-blue-700"
                    }`}
                  >
                    {isOverdue ? "⚠️ " : "📅 "}
                    {formatDate(task.dueDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Right side - Enhanced Priority indicator */}
        {task.priority && (
          <View className="ml-4 items-center ">
            <View
              className={`w-4 h-4 rounded-full bg-gradient-to-br ${getPriorityGradient(
                task.priority
              )} shadow-lg`}
              style={{
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            />
          </View>
        )}
      </View>

      {/* Subtle bottom accent line */}
      <View className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </TouchableOpacity>
  );
}
