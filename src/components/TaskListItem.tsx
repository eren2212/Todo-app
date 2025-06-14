import { View, Text } from "react-native";
import { Task } from "@/types";

export default function TaskListItem({ task }: { task: Task }) {
  return (
    <View>
      <Text>{task.title}</Text>
    </View>
  );
}
