import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container flex-1 flex items-center">
      <section className="my-10 flex flex-1 flex-col lg:flex-row items-center justify-between gap-8">
        <div className="md:w-[37rem]">
          <h1 className="text-4xl md:text-6xl font-bold whitespace-break-spaces transition-transform">
            Create yours Habits
          </h1>
          <Link href="/api/auth/google">
            <Button variant="default">Login Google</Button>
          </Link>
        </div>
        <div className="flex justify-center"></div>
      </section>
    </main>
  );
}
