import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { Calendar as RNCalendar, LocaleConfig } from "react-native-calendars";
import { useQuery } from "@tanstack/react-query";
import { getTasksGroupedByDate } from "@/task";
import { useAuth } from "@/providers/AuthProvider";
import { Tables } from "@/types/database.types";
import { colors } from "@/color";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

type Task = Tables<"tasks">;

LocaleConfig.locales["tr"] = {
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  monthNamesShort: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ],
  dayNames: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ],
  dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
  today: "Bugün",
};

LocaleConfig.defaultLocale = "tr";

export default function Calendar() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: () => getTasksGroupedByDate(user!.id),
    enabled: !!user?.id,
  });

  // Tarihlere göre taskları gruplama
  const tasksGroupedByDate = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {};

    tasks.forEach((task) => {
      const date = new Date(task.created_at).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });

    return grouped;
  }, [tasks]);

  // Takvim için işaretli tarihler
  const markedDates = useMemo(() => {
    const marked: any = {};

    Object.keys(tasksGroupedByDate).forEach((date) => {
      const dayTasks = tasksGroupedByDate[date];
      const completedTasks = dayTasks.filter(
        (task) => task.is_completed
      ).length;
      const totalTasks = dayTasks.length;

      let dotColor = colors.primary;
      if (completedTasks === totalTasks && totalTasks > 0) {
        dotColor = "#10B981"; // Yeşil - tüm tasklar tamamlanmış
      } else if (completedTasks > 0) {
        dotColor = "#F59E0B"; // Sarı - kısmen tamamlanmış
      } else {
        dotColor = "#EF4444"; // Kırmızı - hiç tamamlanmamış
      }

      marked[date] = {
        marked: true,
        dotColor,
      };
    });

    // Seçili tarih için özel stil
    if (selectedDate && marked[selectedDate]) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };
    } else if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marked;
  }, [tasksGroupedByDate, selectedDate]);

  const selectedDateTasks = selectedDate
    ? tasksGroupedByDate[selectedDate] || []
    : [];

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);

    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(scaleValue, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setModalVisible(false);
      setSelectedDate("");
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "Yüksek";
      case "medium":
        return "Orta";
      case "low":
        return "Düşük";
      default:
        return "Düşük";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category?.toLowerCase()) {
      case "work":
        return "İş";
      case "personal":
        return "Kişisel";
      case "shopping":
        return "Alışveriş";
      case "health":
        return "Sağlık";
      case "finance":
        return "Finans";
      case "learning":
        return "Öğrenme";
      case "other":
        return "Diğer";
      default:
        return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderTaskItem = ({ item: task }: { item: Task }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text
            className={`text-lg font-semibold mb-2 ${
              task.is_completed ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </Text>

          {task.description && (
            <Text
              className={`text-sm mb-3 ${
                task.is_completed ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </Text>
          )}

          <View className="flex-row items-center gap-2">
            {task.priority && (
              <View
                className="px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${getPriorityColor(task.priority)}20`,
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: getPriorityColor(task.priority) }}
                >
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>
            )}

            {task.category && (
              <View className="px-2 py-1 bg-blue-100 rounded-full">
                <Text className="text-xs font-medium text-blue-700">
                  {getCategoryLabel(task.category)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          className={`p-2 rounded-full ${
            task.is_completed ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <Feather
            name={task.is_completed ? "check-circle" : "circle"}
            size={20}
            color={task.is_completed ? "#10B981" : "#6B7280"}
          />
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-gray-50"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1 justify-center items-center">
          <LottieView
            source={require("../../../../assets/animations/todo.json")}
            style={{ width: 200, height: 200 }}
            autoPlay
            loop
          />
          <Text className="text-lg text-gray-600 mt-4">
            Takvim yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Takvim</Text>
            <Text className="text-sm text-gray-600 mt-1">
              Görevlerinizi tarihlere göre görüntüleyin
            </Text>
          </View>
          <View className=" h-10 w-10 rounded-full justify-center items-center mt-10">
            <LottieView
              source={require("../../../../assets/animations/calendar2.json")}
              style={{ width: 120, height: 120 }}
              autoPlay
              loop
            />
          </View>
        </View>
      </View>

      {/* Legend */}
      <View className="px-6 py-4 bg-white mx-4 mt-4 rounded-2xl shadow-sm">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          Görev Durumu
        </Text>
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
            <Text className="text-xs text-gray-600">Beklemede</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
            <Text className="text-xs text-gray-600">Kısmen</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <Text className="text-xs text-gray-600">Tamamlandı</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View className="mx-4 mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <RNCalendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          firstDay={1}
          monthFormat={"MMMM yyyy"}
          hideExtraDays={true}
          theme={{
            backgroundColor: "white",
            calendarBackground: "white",
            textSectionTitleColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: "white",
            todayTextColor: colors.primary,
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: colors.primary,
            selectedDotColor: "white",
            arrowColor: colors.primary,
            disabledArrowColor: "#d9e1e8",
            monthTextColor: "#2d4150",
            indicatorColor: colors.primary,
            textDayFontFamily: "System",
            textMonthFontFamily: "System",
            textDayHeaderFontFamily: "System",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={{
            paddingBottom: 10,
          }}
          enableSwipeMonths={true}
        />
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4 h-96">
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
              width: "70%",
              height: "50%",
            }}
            className="bg-white rounded-3xl overflow-hidden"
          >
            {/* Modal Header */}
            <View className="px-6 py-4 bg-blue-500 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">
                  {selectedDate ? formatDate(selectedDate) : ""}
                </Text>
                <Text className="text-blue-100 text-sm mt-1">
                  {selectedDateTasks.length > 0
                    ? `${selectedDateTasks.length} görev`
                    : "Görev bulunamadı"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeModal}
                className="bg-white/20 p-2 rounded-full"
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <View className="flex-1">
              {selectedDateTasks.length > 0 ? (
                <FlatList
                  data={selectedDateTasks}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderTaskItem}
                  contentContainerStyle={{
                    padding: 20,
                  }}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View className="flex-1 justify-center items-center py-12">
                  <LottieView
                    source={require("../../../../assets/animations/todo.json")}
                    style={{ width: 150, height: 150 }}
                    autoPlay
                    loop
                  />
                  <Text className="text-xl font-semibold text-gray-700 mt-4">
                    Bu gün için görev yok
                  </Text>
                  <Text className="text-gray-500 text-center mt-2 px-8">
                    Bugün herhangi bir göreviniz bulunmuyor. Yeni görev eklemek
                    için Ekle sekmesini kullanabilirsiniz.
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
