import React, { useCallback, useState } from "react";
import { getNextMonth, getPrevMonth } from "./utils/utils";

type GetMonthDaysType = {
  currentDate: Date;
  getSurroundedMonthsDate: () => {
    prevMonth: Date;
    nextMonth: Date;
  };
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

export function useDate(date: Date): GetMonthDaysType {
  const [currentDate, setCurrentDate] = useState<Date>(date);

  const getSurroundedMonthsDate = useCallback(() => {
    return {
      prevMonth: getPrevMonth(currentDate),
      nextMonth: getNextMonth(currentDate),
    };
  }, [currentDate]);

  return { currentDate, getSurroundedMonthsDate, setCurrentDate };
}
