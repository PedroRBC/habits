"use client";

import { useAppSelector } from "@/redux/selector";
import { useRouter } from "next/navigation";

export function ProtectRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAppSelector((state) => state.auth);
  if (status === "loading") {
    return null;
  } else if (status === "unlogged") {
    router.push("/");
    return null;
  } else {
    return children;
  }
}
