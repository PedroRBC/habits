import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View className="flex-1 bg-background px-8 items-center justify-center">
      <ActivityIndicator color="#7C3AED" size="large" />
    </View>
  );
}
