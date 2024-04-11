"use client";

import dayjs from "dayjs";

export function generateRangeDatesFromYearStart() {
  let startDate = dayjs().subtract(3, "month").startOf("day");

  while (startDate.day() !== 0) {
    startDate = startDate.subtract(1, "day");
  }

  const endDate = dayjs();
  let dateRange = [];
  let compareDate = startDate;

  while (compareDate.isBefore(endDate)) {
    dateRange.push(compareDate.toDate());
    compareDate = compareDate.add(1, "day");
  }

  return dateRange;
}
