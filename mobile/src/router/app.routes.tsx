import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Loading } from "@/components/loading";
import { useStore } from "@/contexts/store";
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
};

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

export function AppRoutes() {
  const { status } = useStore();
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
        </>
      ) : (
        <Screen name="Login" component={Login} />
      )}
    </Navigator>
  );
}
