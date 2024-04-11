"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useApi } from "@/lib/axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface HabitsListProps {
  date: Date;

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

export function HabitsList({ date, onCompltedChanged }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();
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
      });
  }, []);
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

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        return (
          <div key={habit.id}>
            <Checkbox
              onCheckedChange={() => handleToggleHabit(habit.id)}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              disabled={isDateInPast}
            ></Checkbox>
            <label className="ont-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </label>
          </div>
        );
      })}
    </div>
  );
}
