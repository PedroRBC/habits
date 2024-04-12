"use client";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/selector";
import Link from "next/link";

export default function Home() {
  const { status } = useAppSelector((state) => state.auth);

  return (
    <main className="container flex-1 flex items-center justify-center">
      <section className="flex-1 flex flex-col gap-4 md:flex-row justify-between">
        <h1 className="text-4xl font-bold text-center">Welcome to Habits</h1>

        <div className="flex flex-col items-center space-y-2">
          {status === "logged" ? (
            <>
              <Link href="/summary">
                <Button>View Your habits</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-2xl font-mono">
                <span> Login for start using </span>
                <span> Habits Tracker </span>
              </div>
              <Link href="/api/auth/google">
                <Button variant="default">Login with Google</Button>
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
