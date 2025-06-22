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
  Modal,
  TouchableOpacity,
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
import { useState, useMemo } from "react";
import { Tables } from "@/types/database.types";

type Task = Tables<"tasks">;

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // State'ler
  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "completed"
  >("active");

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(user?.id || ""),
  });

  // Filtrelenmiş ve aranmış görevler
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    let filtered = tasks;

    // Durum filtreleme
    if (activeFilter === "active") {
      filtered = filtered.filter((task) => !task.is_completed);
    } else if (activeFilter === "completed") {
      filtered = filtered.filter((task) => task.is_completed);
    }

    // Arama filtreleme
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    return filtered;
  }, [tasks, activeFilter, searchText]);

  const handleFilterSelect = (filter: "all" | "active" | "completed") => {
    setActiveFilter(filter);
    setFilterModalVisible(false);
  };

  const getFilterButtonText = () => {
    switch (activeFilter) {
      case "active":
        return "Aktif";
      case "completed":
        return "Tamamlanmış";
      default:
        return "Tümü";
    }
  };

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

          {/* Notification Section */}
          <View className="flex-row items-center justify-center">
            {/* Notification Icon */}
            <View className="relative">
              <View className="w-14 h-14 rounded-full items-center justify-center  ">
                <LottieView
                  source={require("../../../../assets/animations/notification2.json")}
                  autoPlay
                  loop
                  style={{
                    width: 60,
                    height: 60,
                  }}
                />
              </View>
              {/* Notification Badge */}
              <View className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
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
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Filter Button */}
          <Pressable
            onPress={() => setFilterModalVisible(true)}
            className="ml-3 w-14 h-14 items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: colors.waterGreen }}
          >
            <Ionicons name="filter-outline" size={24} color="white" />
          </Pressable>
        </View>

        {/* Active Filter Indicator */}
        {activeFilter !== "all" && (
          <View className="mx-2 mt-3">
            <View className="bg-white/20 rounded-full px-4 py-2 self-start">
              <Text className="text-white text-sm font-medium">
                Filtre: {getFilterButtonText()}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Task List */}
      {filteredTasks && filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
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
              {searchText.trim() !== "" || activeFilter !== "all"
                ? "Sonuç bulunamadı"
                : "Henüz bir görev yok"}
            </Text>
            <Text className="text-base text-gray-500 text-center px-8 leading-6">
              {searchText.trim() !== "" || activeFilter !== "all"
                ? "Arama kriterlerinizi değiştirebilir veya filtreyi temizleyebilirsiniz."
                : "İlk görevinizi ekleyerek başlayın ve productivitesinizi artırın!"}
            </Text>
          </View>

          {/* Add Task Button - Only show when no filter/search active */}
          {searchText.trim() === "" && activeFilter === "all" && (
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
          )}
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-6 w-80 mx-4">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">Filtrele</Text>
              <Pressable
                onPress={() => setFilterModalVisible(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* Filter Options */}
            <View className="space-y-3 gap-4">
              {/* Tümü */}
              <TouchableOpacity
                onPress={() => handleFilterSelect("all")}
                className={`flex-row items-center p-4 rounded-2xl ${
                  activeFilter === "all"
                    ? "bg-blue-50 border-2 border-blue-200"
                    : "bg-gray-50"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                    activeFilter === "all"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {activeFilter === "all" && (
                    <FontAwesome name="check" size={12} color="white" />
                  )}
                </View>
                <Text
                  className={`text-base font-medium ${
                    activeFilter === "all" ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  Tüm Görevler
                </Text>
              </TouchableOpacity>

              {/* Aktif Olanlar */}
              <TouchableOpacity
                onPress={() => handleFilterSelect("active")}
                className={`flex-row items-center p-4 rounded-2xl ${
                  activeFilter === "active"
                    ? "bg-green-50 border-2 border-green-200"
                    : "bg-gray-50"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                    activeFilter === "active"
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {activeFilter === "active" && (
                    <FontAwesome name="check" size={12} color="white" />
                  )}
                </View>
                <Text
                  className={`text-base font-medium ${
                    activeFilter === "active"
                      ? "text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  Aktif Olanlar
                </Text>
              </TouchableOpacity>

              {/* Tamamlanmış Olanlar */}
              <TouchableOpacity
                onPress={() => handleFilterSelect("completed")}
                className={`flex-row items-center p-4 rounded-2xl ${
                  activeFilter === "completed"
                    ? "bg-purple-50 border-2 border-purple-200"
                    : "bg-gray-50"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                    activeFilter === "completed"
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300"
                  }`}
                >
                  {activeFilter === "completed" && (
                    <FontAwesome name="check" size={12} color="white" />
                  )}
                </View>
                <Text
                  className={`text-base font-medium ${
                    activeFilter === "completed"
                      ? "text-purple-700"
                      : "text-gray-700"
                  }`}
                >
                  Tamamlanmış Olanlar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
