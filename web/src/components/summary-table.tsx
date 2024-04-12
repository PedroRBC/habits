"use client";

import dayjs from "dayjs";
import { generateRangeDatesFromYearStart } from "@/lib/generate-dates";
import { HabitDay } from "./habit-day";
import { useIsReduced } from "@/lib/useReduced";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateRangeDatesFromYearStart();
const minSummrayDatesSize = 16 * 7;
const amountOfDaysToFill = minSummrayDatesSize - summaryDates.length;

export type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable({ summary }: { summary: Summary }) {
  const useReducedRange = useIsReduced();
  return (
    <div className="w-full flex flex-col lg:flex-row">
      <div className="grid grid-cols-7 lg:grid-cols-none lg:grid-rows-7 grid-flow-row gap-3">
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

      <div className="grid grid-cols-7 lg:grid-cols-none lg:grid-rows-7 grid-flow-row lg:grid-flow-col gap-3">
        {summaryDates.map((date, i) => {
          const dayInSummary = summary.find((day) => {
            return dayjs(date).isSame(day.date, "day");
          });
          if (useReducedRange && i <= 7 * 8 - 1) {
            return null;
          }
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
