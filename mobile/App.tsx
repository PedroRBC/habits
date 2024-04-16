import "./global.css";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import crashlytics from "@react-native-firebase/crashlytics";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider } from "@/components/ui/toast";
import { EnableNotifications } from "@/contexts/notifications";
import { SettingsProvider } from "@/contexts/settings";
import { StoreProvider } from "@/contexts/store";
import { UpdatesProvider } from "@/contexts/updates";
import { Routes } from "@/router";

export default function App() {
  EnableNotifications();

  useEffect(() => {
    crashlytics().log("App mounted.");
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <UpdatesProvider>
          <SettingsProvider>
            <Routes />
            <StatusBar style="auto" />
          </SettingsProvider>
        </UpdatesProvider>
      </StoreProvider>
      <ToastProvider />
    </SafeAreaProvider>
  );
}
