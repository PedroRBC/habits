"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useApi } from "@/lib/axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface HabitsListProps {
  date: Date;
  dayIs: "today" | "before" | "after";

  onCompltedChanged: (completed: number) => void;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function HabitsList({
  date,
  onCompltedChanged,
  dayIs,
}: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();
  const [loadingInfo, setLoadingInfo] = useState(true);
  const api = useApi();
  const queryDate = dayjs(date).format("YYYY-MM-DD");
  useEffect(() => {
    api
      .get("habits/day", {
        params: {
          date: queryDate,
        },
      })
      .then((res) => {
        setHabitsInfo(res.data);
        setLoadingInfo(false);
      });
  }, [api, queryDate]);
  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`);
    const isHabitCompleted = habitsInfo!.completedHabits.includes(habitId);
    let completedHabits: string[] = [];
    if (isHabitCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId,
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    onCompltedChanged(completedHabits.length);
  }

  const notToday = dayIs !== "today";

  return (
    <div className="flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        return (
          <div key={habit.id} className="flex flex-row items-center gap-3">
            <Checkbox
              onCheckedChange={() => handleToggleHabit(habit.id)}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              disabled={notToday}
            ></Checkbox>
            <label className="font-medium text-xl leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </label>
          </div>
        );
      })}
      {loadingInfo && (
        <>
          <div className="flex flex-row gap-3">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
          <div className="flex flex-row gap-3">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </>
      )}
    </div>
  );
}
