import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/color";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/types/database.types";
import { createTask } from "@/task";

type TaskCategory = Database["public"]["Enums"]["task_category"];
type TaskPriority = Database["public"]["Enums"]["task_priority"];

const categoryOptions: { value: TaskCategory; label: string; icon: any }[] = [
  { value: "Work", label: "İş", icon: "briefcase" },
  { value: "Personal", label: "Kişisel", icon: "user" },
  { value: "Shopping", label: "Alışveriş", icon: "shopping-cart" },
  { value: "Health", label: "Sağlık", icon: "heartbeat" },
  { value: "Finance", label: "Finans", icon: "credit-card" },
  { value: "Learning", label: "Öğrenme", icon: "graduation-cap" },
  { value: "Other", label: "Diğer", icon: "ellipsis-h" },
];

const priorityOptions: { value: TaskPriority; label: string; color: string }[] =
  [
    { value: "Low", label: "Düşük", color: "#10B981" },
    { value: "Medium", label: "Orta", color: "#F59E0B" },
    { value: "High", label: "Yüksek", color: "#EF4444" },
  ];

export default function Add() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(
    null
  );
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | null>(
    null
  );
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Görev başlığı gereklidir");
      }
      return createTask(user?.id || "", {
        title: title.trim(),
        is_completed: false,
        description: description.trim() || null,
        category: selectedCategory,
        priority: selectedPriority,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      Alert.alert("Başarılı", "Görev başarıyla eklendi!", [
        {
          text: "Tamam",
          onPress: () => router.back(),
        },
      ]);
      setTitle("");
      setDescription("");
      setSelectedCategory(null);
      setSelectedPriority(null);
    },
    onError: (error: any) => {
      Alert.alert("Hata", error.message || "Görev eklenirken bir hata oluştu");
    },
  });

  const handleSubmit = () => {
    createTaskMutation.mutate();
  };

  const getCategoryIcon = (category: TaskCategory | null) => {
    return (
      categoryOptions.find((option) => option.value === category)?.icon ||
      "question"
    );
  };

  const getCategoryLabel = (category: TaskCategory | null) => {
    return (
      categoryOptions.find((option) => option.value === category)?.label ||
      "Kategori Seç"
    );
  };

  const getPriorityLabel = (priority: TaskPriority | null) => {
    return (
      priorityOptions.find((option) => option.value === priority)?.label ||
      "Öncelik Seç"
    );
  };

  const getPriorityColor = (priority: TaskPriority | null) => {
    return (
      priorityOptions.find((option) => option.value === priority)?.color ||
      "#6B7280"
    );
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
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 items-center justify-center rounded-full bg-white/20"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Text className="text-white text-xl font-bold">Yeni Görev</Text>

          <View className="w-12 h-12" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-gray-700 text-base font-semibold mb-3">
            Görev Başlığı *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Görev başlığını yazın..."
            placeholderTextColor="#9CA3AF"
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-base"
            style={{
              fontSize: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-gray-700 text-base font-semibold mb-3">
            Açıklama
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Görev açıklamasını yazın..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-base"
            style={{
              fontSize: 16,
              height: 100,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        {/* Category Selection */}
        <View className="mb-6">
          <Text className="text-gray-700 text-base font-semibold mb-3">
            Kategori
          </Text>
          <Pressable
            onPress={() => setCategoryModalVisible(true)}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <View className="flex-row items-center">
              <FontAwesome
                name={getCategoryIcon(selectedCategory)}
                size={20}
                color={selectedCategory ? colors.primary : "#9CA3AF"}
              />
              <Text
                className={`ml-3 text-base ${
                  selectedCategory ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {getCategoryLabel(selectedCategory)}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Priority Selection */}
        <View className="mb-8">
          <Text className="text-gray-700 text-base font-semibold mb-3">
            Öncelik
          </Text>
          <Pressable
            onPress={() => setPriorityModalVisible(true)}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center justify-between"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getPriorityColor(selectedPriority) }}
              />
              <Text
                className={`ml-3 text-base ${
                  selectedPriority ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {getPriorityLabel(selectedPriority)}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          disabled={!title.trim() || createTaskMutation.isPending}
          className={`rounded-2xl py-4 px-6 flex-row items-center justify-center ${
            !title.trim() || createTaskMutation.isPending
              ? "bg-gray-300"
              : "bg-blue-600"
          }`}
          style={{
            backgroundColor:
              !title.trim() || createTaskMutation.isPending
                ? "#D1D5DB"
                : colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {createTaskMutation.isPending ? (
            <View className="flex-row items-center">
              <Text className="text-white text-base font-semibold mr-2">
                Ekleniyor...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <FontAwesome name="plus" size={18} color="white" />
              <Text className="text-white text-base font-semibold ml-2">
                Görevi Ekle
              </Text>
            </View>
          )}
        </Pressable>
      </ScrollView>

      {/* Category Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-6 w-80 mx-4 max-h-1/2">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Kategori Seç
              </Text>
              <Pressable
                onPress={() => setCategoryModalVisible(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-3 gap-3">
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setSelectedCategory(option.value);
                      setCategoryModalVisible(false);
                    }}
                    className={`flex-row items-center p-4 rounded-2xl ${
                      selectedCategory === option.value
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <FontAwesome
                      name={option.icon}
                      size={20}
                      color={
                        selectedCategory === option.value
                          ? colors.primary
                          : "#6B7280"
                      }
                    />
                    <Text
                      className={`ml-3 text-base font-medium ${
                        selectedCategory === option.value
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                    {selectedCategory === option.value && (
                      <View className="ml-auto">
                        <FontAwesome
                          name="check"
                          size={16}
                          color={colors.primary}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Priority Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={priorityModalVisible}
        onRequestClose={() => setPriorityModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-6 w-80 mx-4">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Öncelik Seç
              </Text>
              <Pressable
                onPress={() => setPriorityModalVisible(false)}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <View className="space-y-3 gap-3">
              {priorityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    setSelectedPriority(option.value);
                    setPriorityModalVisible(false);
                  }}
                  className={`flex-row items-center p-4 rounded-2xl ${
                    selectedPriority === option.value
                      ? "bg-blue-50 border-2 border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <View
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <Text
                    className={`ml-3 text-base font-medium ${
                      selectedPriority === option.value
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                  {selectedPriority === option.value && (
                    <View className="ml-auto">
                      <FontAwesome
                        name="check"
                        size={16}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
