import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Create } from "@/screens/Create";
import { Day } from "@/screens/Day";
import { Home } from "@/screens/Home";
import { Settings } from "@/screens/Settings";

export type AppStackParamList = {
  Home: undefined;
  Day: { date: string; dayIs: "today" | "before" | "after" };
  Create: undefined;
  Settings: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

export function AppRoutes() {
  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
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
    </Navigator>
  );
}
