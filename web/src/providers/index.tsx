import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "./ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./AuthProvider";
import { ReduxProvider } from "./ReduxProvider";

import { store } from "@/redux/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ReduxProvider store={store}>
        {children}
        <AuthProvider />
      </ReduxProvider>
      <TailwindIndicator />
      <Analytics />
    </ThemeProvider>
  );
}
