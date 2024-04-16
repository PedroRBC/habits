import { useNavigation } from "@react-navigation/native";
import { nativeApplicationVersion } from "expo-application";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { Return } from "@/components/return";
import { TabPress, TabSection, TabToggle } from "@/components/section-tab";
import { useSettings } from "@/contexts/settings";
import { useStore } from "@/contexts/store";
import { useUpdates } from "@/contexts/updates";

export function Settings() {
  const { top: topInset } = useSafeAreaInsets();
  const version = nativeApplicationVersion ?? "1.0.0";
  const { notifcations, toggleNotifications } = useSettings();
  const { logOut } = useStore();
  const { navigate } = useNavigation();
  const { verifyUpdate } = useUpdates();

  return (
    <View className="flex-1 bg-background text-foreground">
      <View
        className="flex-row items-center justify-between bg-secondary rounded-b-[32px] px-6 mb-8"
        style={{
          paddingTop: topInset + 16,
          paddingBottom: 16,
        }}
      >
        <View className="w-8" />
        <Text className="text-2xl text-foreground font-heading">
          Configurações
        </Text>
        <Return direction="right" />
      </View>

      <View className="flex-1 px-5 gap-6">
        <TabSection label="Conta">
          <TabPress label="Desconectar-se" icon="LogOut" onPress={logOut} />
        </TabSection>
        <TabSection label="Personalização">
          <TabToggle
            label="Notificações"
            icon="Bell"
            checked={notifcations}
            onCheckedChange={toggleNotifications}
          />
        </TabSection>
        <TabSection label="Sobre">
          <TabPress
            label="Verificar Atualizações"
            icon="Globe"
            onPress={() => {
              verifyUpdate();
              Toast.show({
                type: "base",
                text1: "Atualização.",
                text2: "Verificando se existe uma nova versão do aplicativo.",
                visibilityTime: 1500,
              });
            }}
          />
          <TabPress
            label="Change Log"
            icon="Info"
            onPress={() => navigate("ChangeLog")}
          />
        </TabSection>
      </View>
      <Text className="font-subtitle text-foreground text-center text-xl py-6">
        version: {version}
      </Text>
    </View>
  );
}
