"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAppSelector } from "@/redux/selector";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateHabit } from "./create-habit";

export function LoginOrCreate() {
  const { status } = useAppSelector((state) => state.auth);
  if (status === "loading") {
    return <Skeleton className="w-32 h-10" />;
  } else if (status === "logged") {
    return <CreateHabit />;
  } else {
    return (
      <Link href="/api/auth/google">
        <Button variant="default">Login Google</Button>
      </Link>
    );
  }
}
