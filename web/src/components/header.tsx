import Link from "next/link";

import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/50 backdrop-blur-md">
      <div className="container">
        <div className="lg:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex flex-row items-center text-xl lg:text-2xl font-bold space-x-6"
          >
            <p className="md:inline-block">
              PR
              <span className="text-violet-600 dark:text-violet-400">.</span>
            </p>
            <p>Habits Tracker</p>
          </Link>
          <div className="flex gap-4 items-center text-lg font-medium">
            <Button variant="default">Create Habbit</Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
