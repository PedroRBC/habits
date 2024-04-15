import { ViewProps, View, Text } from "react-native";

import { Button, ButtonProps } from "./ui/button";
import { Switch, SwitchProps } from "./ui/switch";

import * as Icons from "@/components/Icons";
import { cn } from "@/lib/utils";

interface TabSectionProps extends ViewProps {
  label: string;
}

export function TabSection({ label, className, ...props }: TabSectionProps) {
  return (
    <View className="gap-4">
      <Text className="text-foreground text-xl font-heading">{label}</Text>
      <View
        className={cn("bg-secondary rounded-lg p-2 gap-[6px]", className)}
        {...props}
      />
    </View>
  );
}

interface TabPressProps extends ButtonProps {
  label: string;
  icon: keyof typeof Icons;
}

export function TabPress({ label, icon, ...props }: TabPressProps) {
  const Icon = Icons[icon];
  return (
    <Button variant="ghost" className="flex-row justify-between" {...props}>
      <View className="flex-row justify-center">
        <Icon size={24} strokeWidth={1.5} className="text-foreground" />
        <Text className="text-foreground ml-3 font-body text-lg">{label}</Text>
      </View>

      <Icons.ChevronRight
        size={24}
        strokeWidth={1.2}
        className="text-muted-foreground"
      />
    </Button>
  );
}

interface TabToggleProps extends SwitchProps {
  label: string;
  icon: keyof typeof Icons;
}

export function TabToggle({ label, icon, ...props }: TabToggleProps) {
  const Icon = Icons[icon];
  return (
    <View className="flex-row justify-between h-12 px-5 py-3">
      <View className="flex-row justify-center">
        <Icon size={24} strokeWidth={1.5} className="text-foreground" />
        <Text className="text-foreground ml-3 font-body text-lg">{label}</Text>
      </View>

      <Switch {...props} />
    </View>
  );
}
