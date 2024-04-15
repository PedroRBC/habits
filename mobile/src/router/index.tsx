import analytics from "@react-native-firebase/analytics";
import {
  NavigationContainer,
  type NavigationContainerRef,
} from "@react-navigation/native";
import React, { RefObject } from "react";

import { AppRoutes, type AppStackParamList } from "./app.routes";

export function Routes() {
  const routeNameRef = React.useRef<any>();
  const navigationRef =
    React.useRef<NavigationContainerRef<AppStackParamList>>();

  return (
    <NavigationContainer
      linking={{
        prefixes: ["habits-app://route"],
      }}
      ref={
        navigationRef as RefObject<
          NavigationContainerRef<AppStackParamList>
        > | null
      }
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      <AppRoutes />
    </NavigationContainer>
  );
}
