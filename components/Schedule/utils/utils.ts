export function getPrevMonth(date: Date): Date {
  const tempDate = new Date(date);
  tempDate.setDate(1);
  tempDate.setMonth(tempDate.getMonth() - 1);
  return tempDate;
}

export function getNextMonth(date: Date): Date {
  const tempDate = new Date(date);
  tempDate.setDate(1);
  tempDate.setMonth(tempDate.getMonth() + 1);
  return tempDate;
}
