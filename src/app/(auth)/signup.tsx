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

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Animation values
  const imageFloat = useSharedValue(0);
  const cardSlide = useSharedValue(100);

  useEffect(() => {
    // Image floating animation
    imageFloat.value = withRepeat(
      withTiming(8, {
        duration: 3500,
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

  async function signUpWithEmail() {
    if (!fullName.trim()) {
      Alert.alert("Hata", "Lütfen adınızı ve soyadınızı girin");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Hata", "Lütfen email adresinizi girin");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Hata", "Lütfen şifrenizi girin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      Alert.alert("Hata", error.message);
    } else {
      Alert.alert(
        "Başarılı!",
        "Hesabınız oluşturuldu! Email adresinizi kontrol edin."
      );
      router.push("/(auth)/signin");
    }

    setLoading(false);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
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
              <View className="flex-1 px-6 pt-12">
                {/* Header Section */}
                <View className="items-center mb-8">
                  <Animated.View style={[imageAnimatedStyle]}>
                    <Image
                      source={require("../../../assets/images/giris.png")}
                      style={{
                        width: 180,
                        height: 180,
                        borderRadius: 90, // Oval shape
                      }}
                      resizeMode="cover"
                    />
                  </Animated.View>

                  <Text className="text-white text-3xl font-bold mb-2 text-center mt-4">
                    Hesap Oluştur 🚀
                  </Text>

                  <Text className="text-white/80 text-base text-center leading-6">
                    Yeni hesabınızı oluşturun{"\n"}ve todo dünyasına katılın
                  </Text>
                </View>

                {/* Card Section */}
                <Animated.View style={[{ flex: 1 }, cardAnimatedStyle]}>
                  <View className="bg-white rounded-t-3xl flex-1 px-6 pt-8 pb-5 shadow-lg">
                    <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
                      Kayıt Ol
                    </Text>
                    <Text className="text-sm text-gray-500 mb-6 text-center">
                      Bilgilerinizi girerek hesap oluşturun
                    </Text>

                    {/* Full Name Input */}
                    <View className="mb-4">
                      <Text className="text-gray-700 text-sm font-medium mb-2">
                        Ad Soyad
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                        placeholder="Adınız ve soyadınız"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                      />
                    </View>

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
                    <View className="mb-4">
                      <Text className="text-gray-700 text-sm font-medium mb-2">
                        Şifre
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                        placeholder="En az 6 karakter"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>

                    {/* Confirm Password Input */}
                    <View className="mb-6">
                      <Text className="text-gray-700 text-sm font-medium mb-2">
                        Şifre Tekrar
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800"
                        placeholder="Şifrenizi tekrar girin"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                      className="bg-blue-600 rounded-xl py-4 mb-6"
                      onPress={signUpWithEmail}
                      disabled={loading}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      <Text className="text-white text-center font-semibold text-lg">
                        {loading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
                      </Text>
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center">
                      <Text className="text-gray-600 text-sm">
                        Zaten hesabınız var mı?{" "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.replace("/(auth)/signin")}
                      >
                        <Text className="text-blue-600 text-sm font-medium">
                          Giriş Yap
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
    </>
  );
}
