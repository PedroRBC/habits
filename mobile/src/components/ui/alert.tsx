import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";
import { Text, View, ViewStyle } from "react-native";

import { cn } from "../../lib/utils";

const alertVariants = cva(
  "bg-background relative w-full rounded-lg border p-5 shadow shadow-foreground/10",
  {
    variants: {
      variant: {
        default: "border-foreground",
        destructive: "border-destructive",
        success: "border-emerald-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  React.ElementRef<typeof View>,
  Omit<React.ComponentPropsWithoutRef<typeof View>, "style"> &
    VariantProps<typeof alertVariants> & {
      icon?: LucideIcon;
      style?: ViewStyle;
    }
>(
  (
    { children, icon: Icon, className, variant, style: styleProp, ...props },
    ref,
  ) => {
    return (
      <View
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          !!Icon && "ios:pl-[50] android:pl-[50] pl-[50px]",
          className,
        )}
        {...props}
      >
        {!!Icon && (
          <View className="absolute left-[16px] top-[18px] native:left-[15] native:top-[15]">
            <Icon
              size={21}
              className={cn(
                "w-5 h-5",
                variant === "destructive"
                  ? "text-destructive"
                  : variant === "success"
                    ? "text-emerald-500"
                    : "text-foreground",
              )}
            />
          </View>
        )}
        {children}
      </View>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(
      "mb-1.5 text-xl font-medium leading-none tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
