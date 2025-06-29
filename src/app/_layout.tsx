import { Slot } from "expo-router";
import "../../global.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
}
