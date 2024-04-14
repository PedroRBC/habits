import { useColorScheme } from "nativewind";

const colors = {
  background: "hsl(0, 0%, 100%)",
  foreground: "hsl(224, 71.4%, 4.1%)",
  card: "hsl(0, 0%, 100%)",
  cardForeground: "hsl(224, 71.4%, 4.1%)",
  popover: "hsl(0, 0%, 100%)",
  popoverForeground: "hsl(224, 71.4%, 4.1%)",
  primary: "hsl(262.1, 83.3%, 57.8%)",
  primaryForeground: "hsl(210, 20%, 98%)",
  secondary: "hsl(220, 14.3%, 95.9%)",
  secondaryForeground: "hsl(220.9, 39.3%, 11%)",
  muted: "hsl(220, 14.3%, 95.9%)",
  mutedForeground: "hsl(220, 8.9%, 46.1%)",
  accent: "hsl(220, 14.3%, 95.9%)",
  accentForeground: "hsl(220.9, 39.3%, 11%)",
  destructive: "hsl(0, 84.2%, 60.2%)",
  destructiveForeground: "hsl(210, 20%, 98%)",
  border: "hsl(220, 13%, 91%)",
  input: "hsl(220, 13%, 91%)",
  ring: "hsl(262.1, 83.3%, 57.8%)",
};

const darkColors: typeof colors = {
  background: "hsl(0, 0%, 1%)",
  foreground: "hsl(210, 20%, 98%)",
  card: "hsl(224, 71.4%, 4.1%)",
  cardForeground: "hsl(210, 20%, 98%)",
  popover: "hsl(224, 71.4%, 4.1%)",
  popoverForeground: "hsl(210, 20%, 98%)",
  primary: "hsl(263.4, 70%, 50.4%)",
  primaryForeground: "hsl(210, 20%, 98%)",
  secondary: "hsl(215, 27.9%, 16.9%)",
  secondaryForeground: "hsl(210, 20%, 98%)",
  muted: "hsl(215, 27.9%, 16.9%)",
  mutedForeground: "hsl(217.9, 10.6%, 64.9%)",
  accent: "hsl(215, 27.9%, 16.9%)",
  accentForeground: "hsl(210, 20%, 98%)",
  destructive: "hsl(0, 62.8%, 30.6%)",
  destructiveForeground: "hsl(210, 20%, 98%)",
  border: "hsl(215, 27.9%, 16.9%)",
  input: "hsl(215, 27.9%, 16.9%)",
  ring: "hsl(263.4, 70%, 50.4%)",
};

export function useColor() {
  const { colorScheme } = useColorScheme();

  return colorScheme === "dark" ? darkColors : colors;
}
