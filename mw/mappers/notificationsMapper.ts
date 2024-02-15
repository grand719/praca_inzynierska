import { NotificationT, MappedNotificationT } from "../requesters/RDBRequester";

export function notificationsMapper(
  n: Record<string, NotificationT>,
): MappedNotificationT[] {
  const data: MappedNotificationT[] = [];
  for (const nid in n) {
    data.unshift({ ...n[nid], id: nid });
  }

  return data;
}
