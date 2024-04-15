import * as React from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import * as SwitchPrimitives from "@/components/primitives/switch";
import { type SwitchRootProps as SwitchPrimativeProp } from "@/components/primitives/switch/types";
import { useColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
const RGB_COLORS = {
  light: {
    primary: "rgb(24, 24, 27)",
    input: "rgb(228, 228, 231)",
  },
  dark: {
    primary: "rgb(250, 250, 250)",
    input: "rgb(39, 39, 42)",
  },
} as const;
export type SwitchProps = SwitchPrimativeProp;
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const translateX = useDerivedValue(() => (props.checked ? 18 : 0));
  const colors = useColor();
  const animatedRootStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, 18],
        [colors.mutedForeground, colors.primary],
      ),
    };
  });
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value, { duration: 200 }) },
    ],
  }));
  return (
    <Animated.View
      style={animatedRootStyle}
      className={cn(
        "h-8 w-[46px] rounded-full",
        props.disabled && "opacity-50",
      )}
    >
      <SwitchPrimitives.Root
        className={cn(
          "flex-row h-8 w-[46px] shrink-0 items-center rounded-full border-2 border-transparent",
          className,
        )}
        {...props}
        ref={ref}
      >
        <Animated.View style={animatedThumbStyle}>
          <SwitchPrimitives.Thumb className="h-7 w-7 rounded-full bg-background shadow-md shadow-foreground/25 ring-0" />
        </Animated.View>
      </SwitchPrimitives.Root>
    </Animated.View>
  );
});
Switch.displayName = "Switch";

export { Switch };
