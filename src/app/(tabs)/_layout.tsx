import { Tabs } from "expo-router";
import { AntDesign, FontAwesome6, Octicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

// Tema ayarlarını burada merkezi olarak tanımlamak iyi bir yaklaşımdır.
// Bu sayede renkleri veya ikon boyutlarını tek bir yerden kolayca değiştirebilirsin.
export const theme = {
  colors: {
    active: "#6055EF", // Aktif sekme rengi
    inactive: "#999", // Pasif sekme rengi
    background: "#fff", // Tab bar arka plan rengi
  },
  iconSize: 30, // İkon boyutu (biraz küçültüldü)
  tabBarHeight: 80, // Tab bar yüksekliği (daha kompakt)
  tabBarBottomMargin: 25, // Alttan boşluk
  tabBarBorderRadius: 35, // Oval görünüm için border radius
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // Aktif ve pasif sekme renklerini tema üzerinden al
        tabBarActiveTintColor: theme.colors.active,
        tabBarInactiveTintColor: theme.colors.inactive,
        tabBarShowLabel: false, // Sekme etiketlerini gizle

        // Tab bar'ın genel stilini burada tanımlıyoruz
        tabBarStyle: {
          position: "absolute", // 'absolute' pozisyonlandırma ile yüzen bir görünüm elde ederiz
          bottom: theme.tabBarBottomMargin, // Ekranın altından belirli bir boşluk bırak

          backgroundColor: theme.colors.background, // Tema üzerinden arka plan rengini al
          borderRadius: theme.tabBarBorderRadius, // Yüksek bir border radius ile oval/hap şeklinde bir görünüm sağla
          height: theme.tabBarHeight, // Tab bar yüksekliğini ayarla

          // İçerik ve ikonlar için yatay ve dikey dolgu - daha iyi ortalama için
          paddingHorizontal: 15,
          paddingVertical: 0, // Dikey padding'i kaldırdık
          paddingBottom: 8, // Sadece alt padding
          paddingTop: 8, // Sadece üst padding
          marginHorizontal: 20,
          marginBottom: 10,

          // Flexbox ile ikonları mükemmel ortalama
          justifyContent: "center",
          alignItems: "center",

          // iOS için gölge ayarları - daha yumuşak gölge
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,

          // Android için gölge (elevation) ayarı
          elevation: 8,

          // Kenarlık ekleme (opsiyonel - daha şık görünüm için)
          borderWidth: 0.5,
          borderColor: "rgba(0,0,0,0.05)",
        },

        // İkon container'ı için ek stil
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },

        // Tab item'ları için ek stil
        tabBarItemStyle: {
          paddingVertical: 8,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      {/* Her bir sekme için Tabs.Screen bileşeni kullanılıyor */}
      <Tabs.Screen
        name="index" // Sekme adı, dosya sistemi tabanlı routing'de önemlidir
        options={{
          headerShown: false, // Her sekme ekranında başlığı gizle
          tabBarIcon: ({ color }) => (
            // tabBarIcon, sekme ikonunu özelleştirmemizi sağlar
            // color prop'u, tabBarActiveTintColor veya tabBarInactiveTintColor'dan gelir
            <AntDesign name="home" size={theme.iconSize} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={theme.iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#6055EF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30,
                // Yukarı çıkması için
              }}
            >
              <Octicons name="pencil" size={24} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="bell" size={theme.iconSize} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={theme.iconSize} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
