import notifee, { type Event, EventType } from "@notifee/react-native";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

import { Loading } from "@/components/loading";
import { useStore } from "@/contexts/store";
import { ChangeLog } from "@/screens/ChangeLog";
import { Create } from "@/screens/Create";
import { Day } from "@/screens/Day";
import { Home } from "@/screens/Home";
import { Login } from "@/screens/Login";
import { Settings } from "@/screens/Settings";

export type AppStackParamList = {
  Home: undefined;
  Day: { date: string; dayIs: "today" | "before" | "after" };
  Create: undefined;
  Settings: undefined;
  Login: undefined;
  Loading: undefined;
  ChangeLog: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

export function AppRoutes() {
  const { status } = useStore();
  const { navigate } = useNavigation();

  // Initial notification open Day screen
  async function bootstrap() {
    if (status === "authenticated") {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        navigate("Day", {
          date: initialNotification.notification.data!.date as string,
          dayIs: "today",
        });
      }
    }
  }

  useEffect(() => {
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function handleNotification({ type, detail }: Event) {
    if (type === EventType.PRESS && detail.notification?.id) {
      const notId = detail.notification.id;
      if (
        notId === "habits-update" &&
        detail.pressAction?.id === "open_update"
      ) {
        navigate("Settings");
      } else if (notId === "habits-notification") {
        navigate("Day", {
          date: detail.notification!.data!.date as string,
          dayIs: "today",
        });
      }
    }
  }

  useEffect(() => {
    return notifee.onForegroundEvent((event) => {
      handleNotification(event);
    });
  }, []);
  useEffect(() => {
    return notifee.onBackgroundEvent(async (event) => {
      handleNotification(event);
    });
  }, []);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <Navigator
      initialRouteName={status === "unauthenticated" ? "Login" : "Home"}
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      {status === "authenticated" ? (
        <>
          <Screen name="Home" component={Home} />
          <Screen name="Day" component={Day} />
          <Screen name="Create" component={Create} />
          <Screen
            name="Settings"
            component={Settings}
            options={{
              animation: "slide_from_left",
            }}
          />
          <Screen name="ChangeLog" component={ChangeLog} />
        </>
      ) : (
        <Screen name="Login" component={Login} />
      )}
    </Navigator>
  );
}
