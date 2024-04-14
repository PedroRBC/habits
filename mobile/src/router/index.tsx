import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

import { StoreContext } from "@/contexts/store";

export function Routes() {
  const { status } = useContext(StoreContext);
  if (status === "loading") {
    return null;
  }
  return (
    <NavigationContainer>
      {status === "authenticated" ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
