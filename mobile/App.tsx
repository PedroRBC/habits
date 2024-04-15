import "./global.css";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider } from "@/components/ui/toast";
import { StoreProvider } from "@/contexts/store";
import { Routes } from "@/router";

export default function App() {
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
        <Routes />
        <StatusBar style="auto" />
      </StoreProvider>
      <ToastProvider />
    </SafeAreaProvider>
  );
}
