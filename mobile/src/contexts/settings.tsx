import notifee from "@notifee/react-native";
import { BatteryWarning, Bell } from "lucide-react-native";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Toast from "react-native-toast-message";

import { askNotificationPermission } from "./notifications";

import { mmkvStorage } from "@/lib/mmkvStorage";

const defaultContext = {
  notifcations: mmkvStorage.getBoolean("notifications") ?? false,
  toggleNotifications: () => {},
  batteryOptimization: true,
};

type Content = typeof defaultContext;

export const SettingsContext = createContext<Content>(defaultContext);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState(
    mmkvStorage.getBoolean("notifications") ?? false,
  );
  const [batteryOptimization, setBatteryOptimization] = useState(true);

  useEffect(() => {
    async function checkBatteryOptimization() {
      const batteryOptimizationEnabled =
        await notifee.isBatteryOptimizationEnabled();
      if (batteryOptimizationEnabled) {
        Toast.show({
          type: "error",
          text1: "Otimização de bateria.",
          text2:
            "A otimização de bateria está ativada, desative-a nas configurações do celular!",
          props: { icon: BatteryWarning },
          visibilityTime: 60 * 1500,
          onPress: () => {
            notifee.openBatteryOptimizationSettings();
          },
        });
      } else {
        setBatteryOptimization(false);
      }
    }
    checkBatteryOptimization();
  }, []);

  async function toggleNotifications() {
    if (notifications) {
      mmkvStorage.set("notifications", false);
      setNotifications(false);
      Toast.show({
        type: "error",
        text1: "Notificações.",
        text2:
          "As notificações estão desativadas, ative-as nas configurações do app para receber lembretes!",
        props: { icon: Bell },
      });
    } else {
      const isAllowed = await askNotificationPermission();
      if (isAllowed) {
        mmkvStorage.set("notifications", true);
        setNotifications(true);
        Toast.show({
          type: "success",
          text1: "Notificações.",
          text2:
            "As notificações estão ativadas, você receberá lembretes diários!",
          props: { icon: Bell },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Notificações.",
          text2:
            "As notificações estão desativadas, ative-as nas configurações do app para receber lembretes!",
          props: { icon: Bell },
        });
      }
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        notifcations: notifications,
        toggleNotifications,
        batteryOptimization,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  return useContext(SettingsContext);
}
