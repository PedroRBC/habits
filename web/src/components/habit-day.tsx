"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import dayjs from "dayjs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { HabitsList } from "./habits-list";
import "@/lib/dayjs";
interface HabitDayProps {
  defaultCompleted?: number;
  amount?: number;
  date: Date;
  dayIs: "today" | "before" | "after";
}

export function HabitDay({
  amount = 0,
  defaultCompleted = 0,
  date,
  dayIs,
}: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);

  const HabitProgress = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format("DD/MM");
  const dayOfWeek = dayjs(date).format("dddd");

  function handleCompletedChange(completed: number) {
    setCompleted(completed);
  }

  // {
  //   amountOfDaysToFill > 0 &&
  //     Array.from({ length: amountOfDaysToFill }).map((_, i) => {
  //       return (
  //         <div
  //           key={i}
  //           className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
  //         />
  //       );
  //     });
  // }

  const colorByProgress = cn(
    HabitProgress === 0 && "bg-primary-foreground border-secondary",
    HabitProgress > 0 &&
      HabitProgress < 20 &&
      "bg-violet-500 border-violet-400",
    HabitProgress >= 20 &&
      HabitProgress < 40 &&
      "bg-violet-600 border-violet-500",
    HabitProgress >= 40 &&
      HabitProgress < 60 &&
      "bg-violet-700 border-violet-500",
    HabitProgress >= 60 &&
      HabitProgress < 80 &&
      "bg-violet-800 border-violet-600",
    HabitProgress >= 80 && "bg-violet-900 border-violet-700",
  );

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "w-10 h-10 rounded-lg border-2 transition-colors",
          dayIs === "today" && cn(colorByProgress, "border border-foreground"),
          dayIs === "before" && colorByProgress,
          dayIs === "after" && "border-zinc-800 bg-zinc-900  opacity-40",
        )}
      ></PopoverTrigger>
      <PopoverContent className="px-4 py-3 rounded-2xl space-y-3">
        <div className="flex flex-row items-center justify-between">
          <span className="font-semibold text-muted-foreground">
            {dayOfWeek}
          </span>
          <span className="font-bold text-2xl">{dayAndMonth}</span>
        </div>

        <Progress value={HabitProgress} />

        <HabitsList
          date={date}
          dayIs={dayIs}
          onCompltedChanged={handleCompletedChange}
        />
      </PopoverContent>
    </Popover>
  );
}
