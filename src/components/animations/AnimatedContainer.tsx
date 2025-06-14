import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { ViewStyle } from "react-native";

export type AnimationType =
  | "float"
  | "pulse"
  | "bounce"
  | "rotate"
  | "shake"
  | "fadeIn"
  | "slideIn"
  | "scaleIn";

interface AnimatedContainerProps {
  children: React.ReactNode;
  animationType: AnimationType;
  duration?: number;
  delay?: number;
  intensity?: number;
  repeat?: boolean;
  style?: ViewStyle;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animationType,
  duration = 2000,
  delay = 0,
  intensity = 1,
  repeat = true,
  style,
  className = "",
}) => {
  const animValue = useSharedValue(0);
  const animValue2 = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      switch (animationType) {
        case "float":
          animValue.value = withRepeat(
            withTiming(10 * intensity, {
              duration,
              easing: Easing.inOut(Easing.sin),
            }),
            repeat ? -1 : 1,
            true
          );
          animValue2.value = withRepeat(
            withTiming(8 * intensity, {
              duration: duration * 1.3,
              easing: Easing.inOut(Easing.sin),
            }),
            repeat ? -1 : 1,
            true
          );
          break;

        case "pulse":
          animValue.value = withRepeat(
            withTiming(0.1 * intensity, {
              duration,
              easing: Easing.inOut(Easing.quad),
            }),
            repeat ? -1 : 1,
            true
          );
          break;

        case "bounce":
          animValue.value = withRepeat(
            withSpring(-20 * intensity, {
              damping: 2,
              stiffness: 100,
            }),
            repeat ? -1 : 1,
            true
          );
          break;

        case "rotate":
          animValue.value = withRepeat(
            withTiming(360, {
              duration,
              easing: Easing.linear,
            }),
            repeat ? -1 : 1,
            false
          );
          break;

        case "shake":
          animValue.value = withRepeat(
            withTiming(10 * intensity, {
              duration: 100,
              easing: Easing.bounce,
            }),
            repeat ? -1 : 8,
            true
          );
          break;

        case "fadeIn":
          animValue.value = withDelay(
            delay,
            withTiming(1, {
              duration,
              easing: Easing.out(Easing.quad),
            })
          );
          break;

        case "slideIn":
          animValue.value = withDelay(
            delay,
            withSpring(0, {
              damping: 15,
              stiffness: 100,
            })
          );
          break;

        case "scaleIn":
          animValue.value = withDelay(
            delay,
            withSpring(1, {
              damping: 15,
              stiffness: 100,
            })
          );
          break;
      }
    };

    // İlk değerleri ayarla
    switch (animationType) {
      case "fadeIn":
        animValue.value = 0;
        break;
      case "slideIn":
        animValue.value = 50;
        break;
      case "scaleIn":
        animValue.value = 0.5;
        break;
      default:
        animValue.value = 0;
    }

    startAnimation();
  }, [animationType, duration, delay, intensity, repeat]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case "float":
        return {
          transform: [
            { translateY: animValue.value },
            { translateX: animValue2.value },
          ],
        };

      case "pulse":
        return {
          transform: [{ scale: 1 + animValue.value }],
        };

      case "bounce":
        return {
          transform: [{ translateY: animValue.value }],
        };

      case "rotate":
        return {
          transform: [{ rotate: `${animValue.value}deg` }],
        };

      case "shake":
        return {
          transform: [{ translateX: animValue.value }],
        };

      case "fadeIn":
        return {
          opacity: animValue.value,
        };

      case "slideIn":
        return {
          transform: [{ translateY: animValue.value }],
        };

      case "scaleIn":
        return {
          transform: [{ scale: animValue.value }],
        };

      default:
        return {};
    }
  });

  return (
    <Animated.View style={[animatedStyle, style]} className={className}>
      {children}
    </Animated.View>
  );
};
