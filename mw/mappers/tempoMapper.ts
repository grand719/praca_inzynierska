import {
  UsersRDBTempoT,
  UserMappedTempoT,
  UserRDBTempoT,
} from "../requesters/RDBRequester";

export const tempoMapper = (response: UsersRDBTempoT): UserMappedTempoT[] => {
  const a: UserMappedTempoT[] = [];
  for (const userId in response) {
    for (const userTempo in response[userId]) {
      for (const tempoId in response[userId][userTempo]) {
        a.push({
          ...response[userId][userTempo][tempoId],
          userId,
          workTime: getWorkTime(
            response[userId][userTempo][tempoId].startTime,
            response[userId][userTempo][tempoId].endTime,
          ),
        });
      }
    }
  }

  return a;
};

export const singleUserTempoMapper = (
  response: UserRDBTempoT,
  id: string,
): UserMappedTempoT[] => {
  const a: UserMappedTempoT[] = [];

  for (const userTempo in response) {
    for (const tempoId in response[userTempo]) {
      a.push({
        ...response[userTempo][tempoId],
        userId: id,
        workTime: getWorkTime(
          response[userTempo][tempoId].startTime,
          response[userTempo][tempoId].endTime,
        ),
      });
    }
  }

  return a;
};

function getWorkTime(start: string, end: string): string {
  const startTime = start.split(":");
  const endTime = end.split(":");

  const t = new Date(
    1972,
    1,
    1,
    parseInt(startTime[0]),
    parseInt(startTime[1]),
  );
  const s = new Date(1972, 1, 1, parseInt(endTime[0]), parseInt(endTime[1]));

  const seconds = Math.floor((s.getTime() - t.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes - hours * 60;
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutesLeft < 10 ? "0" : ""
  }${minutesLeft}`;
}
