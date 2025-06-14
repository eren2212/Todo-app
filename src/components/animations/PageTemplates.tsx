import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContainer, AuthHeader, AuthCard } from "./AuthPageAnimations";

interface AuthPageTemplateProps {
  children?: React.ReactNode;
  headerContent?: React.ReactNode;
  cardContent?: React.ReactNode;
  gradientColors?: [string, string, ...string[]];
  statusBarStyle?: "light-content" | "dark-content";
  statusBarColor?: string;
}

interface SimplePageTemplateProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
}

// Auth sayfaları için hazır şablon
export const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({
  children,
  headerContent,
  cardContent,
  gradientColors = ["#6366f1", "#8b5cf6", "#a855f7"],
  statusBarStyle = "light-content",
  statusBarColor = "#6366f1",
}) => {
  return (
    <>
      <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor} />
      <View className="flex-1">
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
        >
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <AuthContainer className="flex-1 px-6 pt-16">
                {/* Header Section */}
                {headerContent && (
                  <AuthHeader className="items-center mb-10">
                    {headerContent}
                  </AuthHeader>
                )}

                {/* Card Section */}
                {cardContent && (
                  <AuthCard className="flex-1">
                    <View className="bg-white rounded-t-3xl flex-1 px-6 pt-10 pb-5 shadow-2xl">
                      {cardContent}
                    </View>
                  </AuthCard>
                )}

                {/* Custom Content */}
                {children}
              </AuthContainer>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </>
  );
};

// Basit sayfa şablonu
export const SimplePageTemplate: React.FC<SimplePageTemplateProps> = ({
  children,
  backgroundColor = "#ffffff",
  statusBarStyle = "dark-content",
}) => {
  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      <View className="flex-1" style={{ backgroundColor }}>
        <AuthContainer className="flex-1">{children}</AuthContainer>
      </View>
    </>
  );
};
