"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useApi } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "@/lib/generate-dates";
import { HabitDay } from "./habit-day";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateRangeDatesFromYearStart();
const minSummrayDatesSize = 18 * 7;
const amountOfDaysToFill = minSummrayDatesSize - summaryDates.length;

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);
  const api = useApi();
  useEffect(() => {
    api.get("habits/summary").then((res) => {
      setSummary(res.data);
    });
  }, []);

  return (
    <div className="w-full flex ">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => {
          return (
            <div
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                key={date.toString()}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
                date={date}
              />
            );
          })}
        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => {
            return (
              <div
                key={i}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            );
          })}
      </div>
    </div>
  );
}
