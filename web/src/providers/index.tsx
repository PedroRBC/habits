import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "./ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {children}
        <TailwindIndicator />
        <SpeedInsights />
      </ThemeProvider>
    </>
  );
}
