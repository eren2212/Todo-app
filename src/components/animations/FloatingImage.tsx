import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ImageSourcePropType } from "react-native";

interface FloatingImageProps {
  source: ImageSourcePropType;
  width?: number;
  height?: number;
  className?: string;
  floatDistance?: number;
  duration?: number;
}

export const FloatingImage: React.FC<FloatingImageProps> = ({
  source,
  width = 300,
  height = 300,
  className = "",
  floatDistance = 15,
  duration = 3000,
}) => {
  // Animasyon değerleri
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // X ekseni animasyonu (sağa-sola)
    translateX.value = withRepeat(
      withTiming(floatDistance, {
        duration: duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1, // Sonsuz tekrar
      true // Geri dönüş (reverse)
    );

    // Y ekseni animasyonu (yukarı-aşağı) - X'ten biraz farklı timing
    translateY.value = withRepeat(
      withTiming(floatDistance * 0.8, {
        duration: duration * 1.2,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    // Hafif rotasyon animasyonu
    rotate.value = withRepeat(
      withTiming(5, {
        duration: duration * 2,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [floatDistance, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  return (
    <Animated.Image
      source={source}
      style={[
        animatedStyle,
        {
          width,
          height,
        },
      ]}
      className={`rounded-full ${className}`}
      resizeMode="contain"
    />
  );
};
