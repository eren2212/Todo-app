import TaskListItem from "@/components/TaskListItem";
import { dummyTasks } from "@/dummyData";
import { useAuth } from "@/providers/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { colors } from "@/color";

export default function App() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="light" />

      <FlatList
        data={dummyTasks}
        renderItem={({ item }) => <TaskListItem task={item} />}
        ListHeaderComponent={() => (
          <View
            className="px-6 py-8 rounded-3xl mb-4 "
            style={{ backgroundColor: colors.primary }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: "https://i.pravatar.cc/150?img=1" }}
                  className="w-16 h-16 rounded-full border-2 border-white/30"
                />
                <View className="ml-4">
                  <Text className="text-white/80 text-md font-semibold">
                    Welcome,
                  </Text>
                  <Text className="text-white text-2xl font-bold font-poppins">
                    eren
                  </Text>
                </View>
              </View>

              {/* Notification/Menu Icon */}
              <View className="w-12 h-12  rounded-full items-center justify-center border-4 border-white/30  ">
                <Octicons name="bell-fill" size={22} color="white" />
              </View>
            </View>
          </View>
        )}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}
