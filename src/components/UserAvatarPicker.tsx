import { View, Text, Image, Alert, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SupabaseImage from "@/components/SupabaseImage";
import { useAuth } from "@/providers/AuthProvider";
import { updateProfile } from "@/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export default function UserAvatarPicker({
  currentAvatar,
  onUpload,
}: {
  currentAvatar: string;
  onUpload: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: updateAvatarInDB } = useMutation({
    mutationFn: (avatarPath: string) =>
      updateProfile(user!.id, {
        avatar_url: avatarPath,
        id: user!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      Toast.show({
        text1: "Avatar güncellendi!",
        type: "success",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        text1: "Avatar güncellenirken hata oluştu!",
        type: "error",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
    },
  });

  async function uploadAvatar() {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }
      const image = result.assets[0];
      console.log("Got image", image);
      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }
      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );
      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });
      if (uploadError) {
        throw uploadError;
      }

      // First update the local state
      onUpload(data.path);

      // Then automatically update the database
      updateAvatarInDB(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <Pressable onPress={uploadAvatar} className="self-center">
      {uploading ? (
        <View className="w-24 h-24 rounded-full bg-neutral-800 items-center justify-center">
          <Text className="text-white text-xs">Yükleniyor...</Text>
        </View>
      ) : (
        <SupabaseImage
          bucket="avatars"
          path={currentAvatar}
          className="w-24 h-24 rounded-full self-center"
        />
      )}
    </Pressable>
  );
}
