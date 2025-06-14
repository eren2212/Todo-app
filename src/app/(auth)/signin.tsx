import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Alert, Text } from "react-native";
import { router } from "expo-router";
import {
  AuthPageTemplate,
  FloatingImage,
  AnimatedContainer,
  AnimatedInput,
  AnimatedFormButton,
  AnimatedLink,
} from "@/components/animations";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  // Header içeriği
  const headerContent = (
    <>
      <FloatingImage
        source={require("../../../assets/images/giris.png")}
        width={300}
        height={300}
        floatDistance={12}
        duration={4000}
      />

      <AnimatedContainer
        animationType="fadeIn"
        duration={1500}
        delay={800}
        repeat={false}
      >
        <Text className="text-white text-3xl font-bold mb-2 text-center">
          Hoş Geldiniz! 👋
        </Text>
      </AnimatedContainer>

      <AnimatedContainer
        animationType="slideIn"
        duration={1200}
        delay={1200}
        repeat={false}
      >
        <Text className="text-white/80 text-base text-center leading-6">
          Todo uygulamanıza giriş yapın{"\n"}ve görevlerinizi yönetin
        </Text>
      </AnimatedContainer>
    </>
  );

  // Card içeriği
  const cardContent = (
    <>
      <AnimatedContainer animationType="fadeIn" delay={600} repeat={false}>
        <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Giriş Yap
        </Text>
        <Text className="text-sm text-gray-500 mb-8 text-center">
          Hesabınıza erişim sağlayın
        </Text>
      </AnimatedContainer>

      <AnimatedInput
        label="Email Adresi"
        placeholder="ornek@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        delay={800}
      />

      <AnimatedInput
        label="Şifre"
        placeholder="Şifrenizi girin"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        delay={1000}
        containerClassName="mb-8"
      />

      <AnimatedFormButton
        title="Giriş Yap"
        loadingTitle="Giriş Yapılıyor..."
        onPress={signInWithEmail}
        loading={loading}
        delay={1200}
      />

      <AnimatedLink
        text="Hesabınız yok mu?"
        linkText="Hesap Oluştur"
        onPress={() => router.replace("/(auth)/signup")}
        delay={1400}
      />
    </>
  );

  return (
    <AuthPageTemplate headerContent={headerContent} cardContent={cardContent} />
  );
}
