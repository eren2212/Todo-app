import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { ViewStyle } from "react-native";

interface AuthContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

interface AuthHeaderProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface AuthCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface AuthButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

// Ana container animasyonu
export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  style,
  className = "",
}) => {
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]} className={className}>
      {children}
    </Animated.View>
  );
};

// Header animasyonu
export const AuthHeader: React.FC<AuthHeaderProps> = ({
  children,
  delay = 200,
  className = "",
}) => {
  const headerAnim = useSharedValue(-50);

  useEffect(() => {
    headerAnim.value = withDelay(
      delay,
      withSpring(0, { damping: 15, stiffness: 100 })
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerAnim.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  );
};

// Card animasyonu
export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  delay = 400,
  className = "",
}) => {
  const slideAnim = useSharedValue(100);
  const cardAnim = useSharedValue(0.8);

  useEffect(() => {
    slideAnim.value = withDelay(
      delay,
      withSpring(0, { damping: 15, stiffness: 100 })
    );
    cardAnim.value = withDelay(
      delay + 200,
      withSpring(1, { damping: 15, stiffness: 100 })
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }, { scale: cardAnim.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  );
};

// Button animasyonu
export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  onPress,
  disabled = false,
  className = "",
}) => {
  const buttonPressAnim = useSharedValue(1);

  const handlePress = () => {
    buttonPressAnim.value = withSpring(0.95, { duration: 100 }, () => {
      buttonPressAnim.value = withSpring(1, { duration: 100 });
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonPressAnim.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Animated.View
        onTouchStart={handlePress}
        className={className}
        style={{ opacity: disabled ? 0.7 : 1 }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};
