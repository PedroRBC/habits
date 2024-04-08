import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "./ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "./Auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark">
        {children}
        <TailwindIndicator />
        <SpeedInsights />
        <AuthProvider />
      </ThemeProvider>
    </>
  );
}
