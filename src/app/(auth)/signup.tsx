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

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // Header içeriği
  const headerContent = (
    <>
      <FloatingImage
        source={require("../../../assets/images/giris.png")}
        width={280}
        height={280}
        floatDistance={10}
        duration={4500}
      />

      <AnimatedContainer
        animationType="fadeIn"
        duration={1500}
        delay={800}
        repeat={false}
      >
        <Text className="text-white text-3xl font-bold mb-2 text-center">
          Hesap Oluştur 🚀
        </Text>
      </AnimatedContainer>

      <AnimatedContainer
        animationType="slideIn"
        duration={1200}
        delay={1200}
        repeat={false}
      >
        <Text className="text-white/80 text-base text-center leading-6">
          Yeni hesabınızı oluşturun{"\n"}ve todo dünyasına katılın
        </Text>
      </AnimatedContainer>
    </>
  );

  // Card içeriği
  const cardContent = (
    <>
      <AnimatedContainer animationType="fadeIn" delay={600} repeat={false}>
        <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Kayıt Ol
        </Text>
        <Text className="text-sm text-gray-500 mb-6 text-center">
          Bilgilerinizi girerek hesap oluşturun
        </Text>
      </AnimatedContainer>

      <AnimatedInput
        label="Ad Soyad"
        placeholder="Adınız ve soyadınız"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        delay={700}
      />

      <AnimatedInput
        label="Email Adresi"
        placeholder="ornek@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        delay={850}
      />

      <AnimatedInput
        label="Şifre"
        placeholder="En az 6 karakter"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        delay={1000}
      />

      <AnimatedInput
        label="Şifre Tekrar"
        placeholder="Şifrenizi tekrar girin"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        delay={1150}
        containerClassName="mb-8"
      />

      <AnimatedFormButton
        title="Hesap Oluştur"
        loadingTitle="Hesap Oluşturuluyor..."
        onPress={signUpWithEmail}
        loading={loading}
        delay={1300}
      />

      <AnimatedLink
        text="Zaten hesabınız var mı?"
        linkText="Giriş Yap"
        onPress={() => router.replace("/(auth)/signin")}
        delay={1450}
      />
    </>
  );

  return (
    <AuthPageTemplate headerContent={headerContent} cardContent={cardContent} />
  );
}
