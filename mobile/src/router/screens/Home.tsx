import { openAuthSessionAsync } from "expo-web-browser";
import { Button, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Home() {
  const inset = useSafeAreaInsets();

  const _handlePressButtonAsync = async () => {
    openAuthSessionAsync(
      "http://localhost:3000/api/auth/google?redirectApp=true",
    );
  };
  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: inset.top,
      }}
    >
      <Text className="text-2xl font-bold text-foreground ">Home</Text>
      <Button title="Login" onPress={_handlePressButtonAsync} />
    </View>
  );
}
