import { supabase } from "@/lib/supabase";
import { getProfile, updateProfile } from "@/profile";
import { getTasks } from "@/task";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import SupabaseImage from "@/components/SupabaseImage";
import UserAvatarPicker from "@/components/UserAvatarPicker";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export default function Profile() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const toggleDarkMode = () => setIsDarkMode((previousState) => !previousState);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user?.id ?? ""),
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: () => getTasks(user?.id ?? ""),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateProfile(user!.id, {
        avatar_url: avatarUrl,
      }),
    onSuccess: () => {
      Toast.show({
        text1: "Profil güncellendi!",
        type: "success",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
      });
      router.back();
    },
  });

  // İstatistikleri hesapla
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((task) => task.is_completed).length || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // En aktif gün hesapla
  const tasksByDay: { [key: string]: number } = {};
  tasks?.forEach((task) => {
    const day = new Date(task.created_at).toLocaleDateString("tr-TR", {
      weekday: "long",
    });
    tasksByDay[day] = (tasksByDay[day] || 0) + 1;
  });

  const mostActiveDay = Object.entries(tasksByDay).reduce(
    (a, b) => (tasksByDay[a[0]] > tasksByDay[b[0]] ? a : b),
    ["Pazartesi", 0]
  )[0];

  const handleSignOut = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => supabase.auth.signOut(),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        bounces={true}
      >
        {/* Header with gradient background */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 24,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            backgroundColor: "#6055EF",
          }}
        >
          <View className="flex-row items-center mb-6">
            <View className="w-16 h-16 rounded-full items-center justify-center bg-white/20">
              <Feather name="user" size={28} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-white/80 text-sm font-medium">Profile</Text>
              <Text className="text-white text-xl font-bold">Bilgiler</Text>
            </View>
          </View>

          {/* Profile Info */}
          <View className="items-center bg-white rounded-2xl p-4">
            {/* Avatar */}
            <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4 border-4 border-white/30">
              <UserAvatarPicker
                currentAvatar={avatarUrl}
                onUpload={setAvatarUrl}
              />
            </View>

            {/* Name and Username */}
            <Text className="text-black text-xl font-bold mb-1">
              {profile?.full_name || "Kullanıcı"}
            </Text>
            <Text className="text-black/80 text-base">
              @{profile?.username || user?.email?.split("@")[0] || "kullanici"}
            </Text>

            {/* Bio placeholder */}
            <Text className="text-black/70 text-center mt-2 px-4">
              {profile?.bio ||
                "Hayallerinizi gerçekleştirmenin zamanı geldi! 🚀"}
            </Text>

            {/* Stats */}
            <View className="flex-row mt-6 space-x-8 gap-4">
              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <Feather name="target" size={16} color="black" />
                  <Text className="text-black text-lg font-bold ml-1">
                    {totalTasks}
                  </Text>
                </View>
                <Text className="text-black/80 text-xs">Görev</Text>
              </View>

              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <Feather name="percent" size={16} color="black" />
                  <Text className="text-black text-lg font-bold ml-1">
                    {completionRate}
                  </Text>
                </View>
                <Text className="text-black/80 text-xs">Oran</Text>
              </View>

              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <Feather name="calendar" size={16} color="black" />
                  <Text className="text-black text-lg font-bold ml-1">
                    {mostActiveDay.slice(0, 3)}
                  </Text>
                </View>
                <Text className="text-black/80 text-xs">En gün</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="px-6 py-6 space-y-6 gap-4">
          {/* Statistics Card */}

          {/* Achievements */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                🎖 Başarılar
              </Text>
            </View>

            <View className="space-y-3 gap-4">
              <View className="flex-row items-center p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <Text className="text-2xl mr-3">🥇</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    İstikrar Abidesi
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    5 gün üst üste görev tamamladınız
                  </Text>
                </View>
                {totalTasks >= 5 && (
                  <Feather name="check-circle" size={20} color="#6055EF" />
                )}
              </View>

              <View className="flex-row items-center p-3 bg-green-50 rounded-xl border border-green-200">
                <Text className="text-2xl mr-3">🌱</Text>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    Yeni Başlayan
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    İlk görevinizi tamamladınız
                  </Text>
                </View>
                {completedTasks >= 1 && (
                  <Feather name="check-circle" size={20} color="#10b981" />
                )}
              </View>
            </View>
          </View>

          {/* Settings */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="settings" size={24} color="black" />
                <Text className="text-lg font-bold text-gray-900">Ayarlar</Text>
              </View>
            </View>

            <View className="space-y-4 gap-2">
              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <MaterialIcons name="dark-mode" size={24} color="#6055EF" />
                  <Text className="text-gray-700 ml-3">Tema</Text>
                </View>

                <Switch
                  trackColor={{ false: "#767577", true: "#6055EF" }}
                  thumbColor={isDarkMode ? "white" : "black"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleDarkMode}
                  value={isDarkMode}
                />
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <MaterialIcons
                    name="notifications"
                    size={24}
                    color="#6055EF"
                  />
                  <Text className="text-gray-700 ml-3">Bildirim</Text>
                </View>
                <Switch
                  trackColor={{ false: "#767577", true: "#6055EF" }}
                  thumbColor={isEnabled ? "white" : "black"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <MaterialIcons name="language" size={24} color="#6055EF" />
                  <Text className="text-gray-700 ml-3">Dil</Text>
                </View>
                <Text className="text-gray-500">Türkçe</Text>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-2xl p-4 items-center"
            onPress={handleSignOut}
          >
            <Text className="text-red-600 font-semibold text-base">
              Çıkış Yap
            </Text>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View style={{ height: insets.bottom + 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}
