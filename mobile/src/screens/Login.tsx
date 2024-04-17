import { openAuthSessionAsync } from "expo-web-browser";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { ApiUrl } from "@/contexts/store";

export function Login() {
  const inset = useSafeAreaInsets();
  return (
    <View
      className="flex-1 flex justify-around bg-background"
      style={{
        paddingTop: inset.top,
      }}
    >
      <View className="items-center">
        <Text className="text-6xl font-bold text-foreground">Habits</Text>
        <Text className="text-5xl font-bold text-foreground">Tracker</Text>
      </View>
      <View className="justify-center items-center">
        <View className="p-4 native:pb-24 max-w-md gap-6">
          <View className="gap-1">
            <Text className="text-muted-foreground text-base text-center">
              Enter with your account to start tracking your habits
            </Text>
          </View>
          <Button
            variant="outline"
            size="lg"
            className="rounded-md"
            onPress={() =>
              openAuthSessionAsync(`${ApiUrl}/auth/google?redirectApp=true`)
            }
          >
            <Text className="text-foreground text-lg">Google</Text>
          </Button>
          <View />
        </View>
      </View>
    </View>
  );
}
