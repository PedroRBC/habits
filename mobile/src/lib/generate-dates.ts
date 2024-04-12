import dayjs from "dayjs";

export function generateRangeDatesFromYearStart() {
  let startDate = dayjs().subtract(3, "month").startOf("day");
  let endDate = dayjs().add(2, "week");

  while (startDate.day() !== 0) {
    startDate = startDate.subtract(1, "day");
  }

  while (endDate.day() !== 6) {
    endDate = endDate.add(1, "day");
  }

  const dateRange = [];
  let compareDate = startDate;

  while (compareDate.isBefore(endDate)) {
    dateRange.push(compareDate.toDate());
    compareDate = compareDate.add(1, "day");
  }

  return dateRange;
}
