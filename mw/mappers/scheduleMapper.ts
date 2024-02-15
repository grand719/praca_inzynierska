import { UserScheduleDataT, UserScheduleT } from "../requesters/RDBRequester";

export type EnrichedUserScheduleT = UserScheduleT & {
  id: string;
};

export const scheduleMapper = (
  response: UserScheduleDataT,
): EnrichedUserScheduleT[] => {
  const a: EnrichedUserScheduleT[] = [];
  for (const id in response) {
    for (const key in response[id]) {
      for (const data in response[id][key]) {
        a.push({ ...response[id][key][data], id: id });
      }
    }
  }

  return a;
};
