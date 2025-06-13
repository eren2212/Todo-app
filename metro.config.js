// metro.config.js

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// 1. Varsayılan Expo config'i al
const defaultConfig = getDefaultConfig(__dirname);

// 2. NativeWind ile sarmala
const nativeWindConfig = withNativeWind(defaultConfig, {
  input: "./global.css", // Eğer global.css dosyası kullanıyorsan
});

// 3. Son olarak Reanimated ile sarmala
const finalConfig = wrapWithReanimatedMetroConfig(nativeWindConfig);

// 4. Dışa aktar
module.exports = finalConfig;
