import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Image, Text, View } from "react-native";

const downloadImage = async (
  bucket: string,
  path: string,
  transform?: { width: number; height: number }
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage.from(bucket).download(path, {
      transform,
    });
    if (error) {
      return reject(error);
    }
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      resolve(fr.result as string);
    };
  });
};

export default function SupabaseImage({
  bucket,
  path,
  className,
  transform,
}: {
  bucket: string;
  path: string;
  className: string;
  transform?: { width: number; height: number };
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["supabaseImage", { bucket, path, transform }],
    queryFn: () => downloadImage(bucket, path, transform),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!path && path.trim() !== "", // Only fetch if path exists and is not empty
  });

  const defaultImage = require("../../assets/images/giris.png");

  // If no path provided or error occurred, show default image
  if (!path || path.trim() === "" || error) {
    return (
      <Image source={defaultImage} className={`${className} bg-neutral-900`} />
    );
  }

  // While loading, show default image
  if (isLoading) {
    return (
      <Image source={defaultImage} className={`${className} bg-neutral-900`} />
    );
  }

  // Show downloaded image or default if no data
  return (
    <Image
      source={data ? { uri: data } : defaultImage}
      className={`${className} bg-neutral-900`}
    />
  );
}
