import { openAuthSessionAsync } from "expo-web-browser";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://habits.pedrorbc.com/api"
    : "http://localhost:3000/api";

export function Login() {
  const inset = useSafeAreaInsets();

  const handlePressLogin = async () => {
    openAuthSessionAsync(`${ApiUrl}/auth/google?redirectApp=true`);
  };
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
      <View className="items-center">
        <TouchableOpacity
          onPress={handlePressLogin}
          className="bg-secondary p-2 rounded-md mt-2"
        >
          <Text className="text-foreground text-lg">Entrar com Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
