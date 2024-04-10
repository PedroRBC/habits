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
  const { logged, loading } = useAppSelector((state) => state.auth);
  if (!loading && !logged) {
    router.push("/");
  } else if (loading) {
    return null;
  }
  return children;
}
