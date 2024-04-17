import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableWithoutFeedback } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { CirclePlus } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/store";

export function Header() {
  const { navigate } = useNavigation();
  const { user } = useStore();
  return (
    <View className="w-full flex-row p-4 mb-4 border-b border-border items-center justify-between">
      <TouchableWithoutFeedback onPress={() => navigate("Settings")}>
        <View className="flex-row items-center gap-4">
          <Avatar
            className="h-[48px] w-[48px] border-2 border-border"
            alt={user.name}
          >
            <AvatarImage source={{ uri: user.avatarUrl }} />
          </Avatar>
        </View>
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
