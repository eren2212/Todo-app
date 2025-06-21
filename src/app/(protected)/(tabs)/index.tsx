import TaskListItem from "@/components/TaskListItem";
import { useAuth } from "@/providers/AuthProvider";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/task";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  console.log(user?.id);
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(user?.id || ""),
  });
  console.log(JSON.stringify(tasks, null, 2));

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar style="light" />

      {/* Custom Header with SafeArea */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          backgroundColor: colors.primary,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=1" }}
              className="w-16 h-16 rounded-full border-2 border-white/30"
            />
            <View className="ml-4">
              <Text className="text-white/80 text-sm font-medium">
                Hoşgeldiniz,
              </Text>
              <Text className="text-white text-xl font-bold">
                {user?.user_metadata?.full_name || "Eren"}
              </Text>
            </View>
          </View>

          {/* Notification Icon */}
          <View className="relative">
            <View className="w-14 h-14 rounded-full items-center justify-center border-4 border-white/30">
              <FontAwesome name="bell" size={22} color="white" />
            </View>
            {/* Notification Badge */}
            <View className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center mt-10 mx-2">
          {/* Search Container */}
          <View className="flex-1 flex-row items-center bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Search Icon */}
            <View className="pl-6 pr-4 py-4">
              <FontAwesome name="search" size={20} color="#9CA3AF" />
            </View>

            {/* Text Input */}
            <TextInput
              placeholder="Arama Yapın"
              placeholderTextColor="#9CA3AF"
              className="flex-1 py-4 pr-6 text-gray-800 text-base"
              style={{
                fontSize: 16,
                fontWeight: "400",
              }}
            />
          </View>

          {/* Filter Button */}
          <View
            className="ml-3 w-14 h-14 items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: colors.waterGreen }}
          >
            <Ionicons name="filter-outline" size={24} color="white" />
          </View>
        </View>
      </View>

      {/* Task List */}
      {tasks && tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={({ item }) => <TaskListItem task={item} />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 16,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center mb-28">
          {/* Lottie Animation */}
          <View className="items-center mb-8">
            <LottieView
              source={require("../../../../assets/animations/todo.json")}
              autoPlay
              loop
              style={{
                width: 200,
                height: 200,
              }}
            />
          </View>

          {/* Empty State Content */}
          <View className="items-center space-y-4">
            <Text className="text-2xl font-bold text-gray-700 text-center">
              Henüz bir görev yok
            </Text>
            <Text className="text-base text-gray-500 text-center px-8 leading-6">
              İlk görevinizi ekleyerek başlayın ve productivitesinizi artırın!
            </Text>
          </View>

          {/* Add Task Button */}
          <Pressable
            onPress={() => {
              router.push("/add");
            }}
            className="mt-8 w-full max-w-xs mx-auto"
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 16,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <View className="flex-row items-center justify-center space-x-2">
              <FontAwesome name="plus" size={18} color="white" />
              <Text className="text-white text-center font-semibold text-base ml-2">
                İlk Görevini Ekle
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}
