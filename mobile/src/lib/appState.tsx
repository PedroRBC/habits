import analytics from "@react-native-firebase/analytics";
import { AppState } from "react-native";

export function appStateListener() {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      analytics().logAppOpen();
    } else if (state === "background") {
      analytics().logEvent("app_background");
    }
  });
}
