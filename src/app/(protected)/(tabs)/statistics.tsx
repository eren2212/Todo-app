import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/color";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/task";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
} from "react-native-chart-kit";
import { useMemo } from "react";
import { Tables } from "@/types/database.types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

type Task = Tables<"tasks">;

const { width: screenWidth } = Dimensions.get("window");

export default function Statistics() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(user?.id || ""),
  });

  // Haftalık veri hesaplama
  const weeklyData = useMemo(() => {
    if (!tasks) return { labels: [], datasets: [{ data: [] }] };

    const today = new Date();
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.created_at);
        return taskDate.toDateString() === date.toDateString();
      });

      const completed = dayTasks.filter((task) => task.is_completed).length;
      const total = dayTasks.length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;

      labels.push(date.toLocaleDateString("tr-TR", { weekday: "short" }));
      data.push(Math.round(percentage));
    }

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(96, 85, 239, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  }, [tasks]);

  // Kategori bazında dağılım
  const categoryData = useMemo(() => {
    if (!tasks) return [];

    const categoryMap: {
      [key: string]: { count: number; color: string; label: string };
    } = {
      Work: { count: 0, color: "#6366f1", label: "İş" },
      Personal: { count: 0, color: "#ec4899", label: "Kişisel" },
      Shopping: { count: 0, color: "#10b981", label: "Alışveriş" },
      Health: { count: 0, color: "#f59e0b", label: "Sağlık" },
      Finance: { count: 0, color: "#ef4444", label: "Finans" },
      Learning: { count: 0, color: "#8b5cf6", label: "Öğrenme" },
      Other: { count: 0, color: "#6b7280", label: "Diğer" },
    };

    tasks.forEach((task) => {
      if (task.category && categoryMap[task.category]) {
        categoryMap[task.category].count++;
      }
    });

    return Object.entries(categoryMap)
      .filter(([_, data]) => data.count > 0)
      .map(([key, data]) => ({
        name: data.label,
        population: data.count,
        color: data.color,
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      }));
  }, [tasks]);

  // Bar chart verisi
  const barData = useMemo(() => {
    if (!tasks) return { labels: [], datasets: [{ data: [] }] };

    const completedByCategory: { [key: string]: number } = {};
    const totalByCategory: { [key: string]: number } = {};

    const categories = [
      "Work",
      "Personal",
      "Shopping",
      "Health",
      "Finance",
      "Learning",
    ];
    const categoryLabels = [
      "İş",
      "Kişisel",
      "Alışveriş",
      "Sağlık",
      "Finans",
      "Öğrenme",
    ];

    categories.forEach((cat) => {
      completedByCategory[cat] = 0;
      totalByCategory[cat] = 0;
    });

    tasks.forEach((task) => {
      if (task.category && categories.includes(task.category)) {
        totalByCategory[task.category]++;
        if (task.is_completed) {
          completedByCategory[task.category]++;
        }
      }
    });

    const data = categories.map((cat) =>
      totalByCategory[cat] > 0
        ? Math.round((completedByCategory[cat] / totalByCategory[cat]) * 100)
        : 0
    );

    return {
      labels: categoryLabels,
      datasets: [
        {
          data,
          colors: [
            (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
            (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
            (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
            (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
            (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          ],
        },
      ],
    };
  }, [tasks]);

  // Genel istatistikler
  const stats = useMemo(() => {
    if (!tasks)
      return { total: 0, completed: 0, pending: 0, completionRate: 0 };

    const total = tasks.length;
    const completed = tasks.filter((task) => task.is_completed).length;
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [tasks]);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(96, 85, 239, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary,
    },
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    backgroundColor,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
    backgroundColor: string;
  }) => (
    <View
      className="flex-1 mx-2 p-4 rounded-2xl"
      style={{
        backgroundColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: color + "20" }}
        >
          <FontAwesome name={icon} size={18} color={color} />
        </View>
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-1">{value}</Text>
      <Text className="text-sm text-gray-600">{title}</Text>
      {subtitle && (
        <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
      )}
    </View>
  );

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
            <View className="w-16 h-16 rounded-full items-center justify-center bg-white/20">
              <FontAwesome name="bar-chart" size={28} color="white" />
            </View>
            <View className="ml-4">
              <Text className="text-white/80 text-sm font-medium">
                Performans
              </Text>
              <Text className="text-white text-xl font-bold">
                İstatistikler
              </Text>
            </View>
          </View>

          {/* Animation */}
          <View>
            <LottieView
              source={require("../../../../assets/animations/statics.json")}
              autoPlay
              loop
              style={{
                width: 80,
                height: 80,
              }}
            />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 200,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* İstatistik Kartları */}
        <View className="flex-row mb-6">
          <StatCard
            title="Toplam Görev"
            value={stats.total}
            icon="tasks"
            color="#6366f1"
            backgroundColor="white"
          />
          <StatCard
            title="Tamamlanan"
            value={stats.completed}
            icon="check-circle"
            color="#10b981"
            backgroundColor="white"
          />
        </View>

        <View className="flex-row mb-6">
          <StatCard
            title="Bekleyen"
            value={stats.pending}
            icon="clock-o"
            color="#f59e0b"
            backgroundColor="white"
          />
          <StatCard
            title="Başarı Oranı"
            value={`%${stats.completionRate}`}
            icon="trophy"
            color="#ec4899"
            backgroundColor="white"
          />
        </View>

        {/* Haftalık İlerleme Grafiği */}
        <View
          className="bg-white rounded-2xl p-6 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center mb-4">
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="trending-up" size={20} color="white" />
            </LinearGradient>
            <Text className="text-lg font-bold text-gray-800 ml-3">
              Haftalık İlerleme
            </Text>
          </View>

          {weeklyData.labels.length > 0 && (
            <LineChart
              data={weeklyData}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                fillShadowGradientFrom: colors.primary,
                fillShadowGradientFromOpacity: 0.4,
                fillShadowGradientTo: colors.waterGreen,
                fillShadowGradientToOpacity: 0.1,
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}

          <View className="flex-row justify-center mt-2">
            <Text className="text-sm text-gray-600">
              Son 7 günlük tamamlama oranı (%)
            </Text>
          </View>
        </View>

        {/* Kategori Performansı - Bar Chart */}
        {barData.labels.length > 0 && (
          <View
            className="bg-white rounded-2xl p-6 mb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center mb-4">
              <LinearGradient
                colors={["#ec4899", "#f59e0b"]}
                className="w-10 h-10 rounded-full items-center justify-center"
              >
                <FontAwesome name="bar-chart-o" size={20} color="white" />
              </LinearGradient>
              <Text className="text-lg font-bold text-gray-800 ml-3">
                Kategori Performansı
              </Text>
            </View>

            <BarChart
              data={barData}
              width={screenWidth - 64}
              height={220}
              yAxisLabel=""
              yAxisSuffix="%"
              chartConfig={{
                ...chartConfig,
                barPercentage: 0.7,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />

            <View className="flex-row justify-center mt-2">
              <Text className="text-sm text-gray-600">
                Kategorilere göre tamamlama oranı (%)
              </Text>
            </View>
          </View>
        )}

        {/* Kategori Dağılımı - Pie Chart */}
        {categoryData.length > 0 && (
          <View
            className="bg-white rounded-2xl p-6 mb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center mb-4">
              <LinearGradient
                colors={["#10b981", "#06d6a0"]}
                className="w-10 h-10 rounded-full items-center justify-center"
              >
                <FontAwesome name="pie-chart" size={20} color="white" />
              </LinearGradient>
              <Text className="text-lg font-bold text-gray-800 ml-3">
                Kategori Dağılımı
              </Text>
            </View>

            <View className="items-center">
              <PieChart
                data={categoryData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
