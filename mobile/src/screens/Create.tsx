import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CreateForm } from "@/components/create-form";
import { Return } from "@/components/return";

export function Create() {
  const { top: topInset } = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background text-foreground"
      style={{
        paddingTop: topInset,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
        <Return />
        <Text className="text-2xl text-primary-foreground font-heading">
          Habits Tracker
        </Text>
        <View className="w-8" />
      </View>

      <CreateForm />
    </View>
  );
}
