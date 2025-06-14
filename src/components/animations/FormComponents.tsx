import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { AnimatedContainer } from "./AnimatedContainer";
import { AuthButton } from "./AuthPageAnimations";

interface AnimatedInputProps extends TextInputProps {
  label: string;
  delay?: number;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

interface AnimatedFormButtonProps {
  title: string;
  loadingTitle?: string;
  onPress: () => void;
  loading?: boolean;
  delay?: number;
  className?: string;
}

interface AnimatedLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
  delay?: number;
  className?: string;
}

// Animasyonlu Input
export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  delay = 0,
  containerClassName = "mb-5",
  labelClassName = "text-sm font-semibold text-gray-700 mb-2 ml-1",
  inputClassName = "bg-gray-50 rounded-2xl border border-gray-200 px-4 py-4",
  ...inputProps
}) => {
  return (
    <AnimatedContainer
      animationType="slideIn"
      delay={delay}
      repeat={false}
      className={containerClassName}
    >
      <Text className={labelClassName}>{label}</Text>
      <View className={inputClassName}>
        <TextInput
          className="text-base text-gray-800 font-medium"
          placeholderTextColor="#9ca3af"
          {...inputProps}
        />
      </View>
    </AnimatedContainer>
  );
};

// Animasyonlu Form Button
export const AnimatedFormButton: React.FC<AnimatedFormButtonProps> = ({
  title,
  loadingTitle = "Yükleniyor...",
  onPress,
  loading = false,
  delay = 0,
  className = "",
}) => {
  return (
    <AnimatedContainer animationType="scaleIn" delay={delay} repeat={false}>
      <AuthButton
        onPress={onPress}
        disabled={loading}
        className={`${
          loading ? "bg-gray-400" : "bg-indigo-500"
        } rounded-2xl py-5 shadow-lg ${className}`}
      >
        <Text className="text-white text-center text-lg font-bold">
          {loading ? loadingTitle : title}
        </Text>
      </AuthButton>
    </AnimatedContainer>
  );
};

// Animasyonlu Link
export const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  text,
  linkText,
  onPress,
  delay = 0,
  className = "flex-row justify-center items-center mt-6 pb-5",
}) => {
  return (
    <AnimatedContainer
      animationType="fadeIn"
      delay={delay}
      repeat={false}
      className={className}
    >
      <Text className="text-gray-500 text-base">{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text className="text-indigo-500 font-bold text-base ml-1">
          {linkText}
        </Text>
      </TouchableOpacity>
    </AnimatedContainer>
  );
};
