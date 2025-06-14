import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Alert,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { colors } from "@/color";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Animation values
  const imageFloat = useSharedValue(0);
  const cardSlide = useSharedValue(100);

  useEffect(() => {
    // Image floating animation
    imageFloat.value = withRepeat(
      withTiming(10, {
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    // Card slide up animation
    cardSlide.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
    });
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: imageFloat.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardSlide.value }],
  }));

  async function signInWithEmail() {
    if (!email.trim()) {
      Alert.alert("Hata", "Lütfen email adresinizi girin");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Hata", "Lütfen şifrenizi girin");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      Alert.alert("Hata", error.message);
    } else {
      Alert.alert("Başarılı!", "Giriş yapıldı!");
    }

    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#6366f1", "#8b5cf6", "#a855f7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-1 px-6 pt-16">
                {/* Header Section */}
                <View className="items-center mb-10">
                  <Animated.View style={[imageAnimatedStyle]}>
                    <Image
                      source={require("../../../assets/images/giris.png")}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100, // Oval shape
                      }}
                      resizeMode="cover"
                    />
                  </Animated.View>

                  <Text className="text-white text-3xl font-bold mb-2 text-center mt-4">
                    Hoş Geldiniz! 👋
                  </Text>

                  <Text className="text-white/80 text-base text-center leading-6">
                    Todo uygulamanıza giriş yapın{"\n"}ve görevlerinizi yönetin
                  </Text>
                </View>

                {/* Card Section */}
                <Animated.View style={[{ flex: 1 }, cardAnimatedStyle]}>
                  <View className="bg-white rounded-t-3xl flex-1 px-6 pt-10 pb-5 shadow-lg">
                    <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
                      Giriş Yap
                    </Text>
                    <Text className="text-sm text-gray-500 mb-8 text-center">
                      Hesabınıza erişim sağlayın
                    </Text>

                    {/* Email Input */}
                    <View className="mb-4">
                      <Text className="text-gray-700 text-sm font-medium mb-2">
                        Email Adresi
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                        placeholder="ornek@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    {/* Password Input */}
                    <View className="mb-8">
                      <Text className="text-gray-700 text-sm font-medium mb-2">
                        Şifre
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                        placeholder="Şifrenizi girin"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                      className="bg-blue-600 rounded-xl py-4 mb-6"
                      onPress={signInWithEmail}
                      disabled={loading}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      <Text className="text-white text-center font-semibold text-lg">
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                      </Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center">
                      <Text className="text-gray-600 text-sm">
                        Hesabınız yok mu?{" "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.replace("/(auth)/signup")}
                      >
                        <Text className="text-blue-600 text-sm font-medium">
                          Hesap Oluştur
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}
