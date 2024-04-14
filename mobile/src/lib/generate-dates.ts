import dayjs from "dayjs";

export async function generateRangeDatesFromYearStart() {
  const now = dayjs().startOf("day");
  const startDate = now.subtract(2, "month").startOf("week");
  const endDate = now.add(2, "week").endOf("week");

  let currentDate = startDate;
  const dateRange = [];

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    dateRange.push(currentDate.toDate());
    currentDate = currentDate.add(1, "day");
  }

  return dateRange;
}
