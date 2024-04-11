import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import dayjs from "dayjs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./progress-bar";
import { HabitsList } from "./habits-list";

interface HabitDayProps {
  defaultCompleted?: number;
  amount?: number;
  date: Date;
}

export function HabitDay({
  amount = 0,
  defaultCompleted = 0,
  date,
}: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);

  const HabitProgress = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format("DD/MM");
  const dayOfWeek = dayjs(date).format("dddd");

  function handleCompletedChange(completed: number) {
    setCompleted(completed);
  }

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "w-10 h-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-800 focus:ring-offset-2 focus:ring-offset-bg",
          {
            "bg-zinc-900 border-zinc-800": HabitProgress === 0,
            "bg-violet-900 border-violet-700":
              HabitProgress > 0 && HabitProgress < 20,
            "bg-violet-800 border-violet-600":
              HabitProgress >= 20 && HabitProgress < 40,
            "bg-violet-700 border-violet-500":
              HabitProgress >= 40 && HabitProgress < 60,
            "bg-violet-600 border-violet-500":
              HabitProgress >= 60 && HabitProgress < 80,
            "bg-violet-500 border-violet-400": HabitProgress >= 80,
          },
        )}
      ></PopoverTrigger>
      <PopoverContent className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
        <div className="p-4">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>

          <ProgressBar progress={HabitProgress} />

          <HabitsList date={date} onCompltedChanged={handleCompletedChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
