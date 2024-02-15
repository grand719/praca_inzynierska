import numeral from "numeral";
import { StuffRentalT } from "../mw/requesters/RDBRequester";

export function doNothing() {
  return;
}

export function isSameDay(firstTimestamp: number, secondTimestamp: number) {
  const d1 = new Date(firstTimestamp);
  const d2 = new Date(secondTimestamp);
  return (
    d1.getDay() === d2.getDay() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

export function isTimeAvailable(
  fistScope: { start: number; end: number },
  secondScope: { start: number; end: number },
) {
  return fistScope.end < secondScope.start || fistScope.start > secondScope.end;
}

export function isTimeAvailableLoop(
  items: StuffRentalT[],
  fistScope: { start: number; end: number },
) {
  let isAvailable = true;
  if (!items) return true;
  for (const rental of items) {
    if (
      !isTimeAvailable(fistScope, {
        start: rental.startRent,
        end: rental.endRent,
      })
    ) {
      isAvailable = false;
      return;
    }
  }
  return isAvailable;
}
