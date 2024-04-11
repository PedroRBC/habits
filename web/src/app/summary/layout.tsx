"use client";

import { useAppSelector } from "@/redux/selector";
import { useRouter } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { status } = useAppSelector((state) => state.auth);
  if (status === "loading") {
    return null;
  } else if (status === "unlogged") {
    router.push("/");
  } else {
    return children;
  }
}
