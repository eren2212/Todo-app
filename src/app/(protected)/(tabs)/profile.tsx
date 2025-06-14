import { supabase } from "@/lib/supabase";
import { View, Text } from "react-native";

export default function Profile() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text
        onPress={() => supabase.auth.signOut()}
        className="text-red-500 justify-center items-center"
      >
        Sign Out
      </Text>
    </View>
  );
}
