import { ProtectRoute } from "@/providers/ProtectRoute";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectRoute>{children}</ProtectRoute>;
}
