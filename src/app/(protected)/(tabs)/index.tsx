import TaskListItem from "@/components/TaskListItem";
import { dummyTasks } from "@/dummyData";
import { useAuth } from "@/providers/AuthProvider";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/build/Ionicons";

export default function App() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

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

        <View className="flex-row items-center justify-between mt-10  p-2">
          <FontAwesome
            name="search"
            size={27}
            color="gainsboro"
            className=" border-white/30  p-4 bg-white rounded-l-3xl border-2"
          />
          <TextInput
            placeholder="Arama Yapın"
            className="bg-white rounded-r-3xl p-6  flex-1 "
          />

          <View
            className="flex-row items-center justify-between  p-4  ml-4 rounded-3xl"
            style={{ backgroundColor: colors.waterGreen }}
          >
            <Ionicons name="filter-outline" size={27} color="white" />
          </View>
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={dummyTasks}
        renderItem={({ item }) => <TaskListItem task={item} />}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
