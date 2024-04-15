import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableWithoutFeedback } from "react-native";

import { CirclePlus } from "@/components/Icons";
import { Button } from "@/components/ui/button";

export function Header() {
  const { navigate } = useNavigation();
  return (
    <View className="w-full flex-row px-2 py-4 my-4 border-b border-border items-center justify-between">
      <TouchableWithoutFeedback onPress={() => navigate("Settings")}>
        <Text className="text-2xl text-foreground font-heading">
          Habits Tracker
        </Text>
      </TouchableWithoutFeedback>

      <Button variant="outline" onPress={() => navigate("Create")}>
        <View className="flex-row items-center justify-center">
          <CirclePlus size={24} strokeWidth={2.5} className="text-foreground" />
          <Text className="text-foreground ml-3 font-semibold text-lg">
            Novo Hábito
          </Text>
        </View>
      </Button>
    </View>
  );
}
