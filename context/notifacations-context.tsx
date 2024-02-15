/* eslint-disable @typescript-eslint/no-empty-function */
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  MappedNotificationT,
  NotificationT,
} from "../mw/requesters/RDBRequester";
import { notificationsMapper } from "../mw/mappers/notificationsMapper";
import { UserContext } from "./user-context";
import mw from "../mw/mw";
import { ToastContex, messageTypes } from "./toast-contex";
import Log from "../logs/Log";
import { doNothing } from "../utils/helper";
import { usePullTimer } from "../hooks/usePullTimer";

const TAG = "NotificationsContext";

type NotificationsContextT = {
  notifications: MappedNotificationT[];
  pullNotifications: () => Promise<void>;
  updateNotifications: (notification: MappedNotificationT) => void;
  deleteNotification: (id: string) => Promise<void>;
};

export const NotificationsContext = createContext<NotificationsContextT>({
  notifications: [],
  pullNotifications: async () => {},
  updateNotifications: (notification: MappedNotificationT) => {},
  deleteNotification: async id => {},
});

export const NotificationsContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const userCtx = useContext(UserContext);
  const toastCtx = useContext(ToastContex);

  const [notifications, setNotifications] = useState<MappedNotificationT[]>([]);

  const setMappedNotifications = useCallback(
    (n: Record<string, NotificationT>) => {
      const newData = notificationsMapper(n);

      setNotifications(newData);
    },
    [],
  );

  const pullNotifications = useCallback(async () => {
    try {
      const response = await mw.rdbRequester.pullNotifications();
      setMappedNotifications(response);
    } catch (e) {
      Log.error(TAG, "Failed to pull notifications: ", e);
      toastCtx.setMessage({
        text: "Failed to pull notifications",
        type: messageTypes.error,
      });
    }
  }, [setMappedNotifications, toastCtx]);

  const { startPulling, stopPulling, allowStartPulling } = usePullTimer(
    pullNotifications,
    120000,
  );

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        await mw.rdbRequester.deleteNotification(id);
        await pullNotifications();
      } catch (e) {
        Log.error(TAG, "Failed to delete notifications", e);
      }
    },
    [pullNotifications],
  );

  const updateNotifications = useCallback(
    async (notification: MappedNotificationT) => {
      const isNotificationsSeen = notifications?.find(
        n =>
          n.id === notification.id &&
          !!n.seenBy.find(user => user.uid === userCtx.user.localId),
      );
      if (isNotificationsSeen) {
        return Promise.resolve();
      }
      try {
        await mw.rdbRequester.markAsReade(notification, userCtx.user);
        await pullNotifications();
      } catch (e) {
        Log.error(TAG, "Failed to update notification", e);
      }
    },
    [notifications, pullNotifications, userCtx.user],
  );

  useEffect(() => {
    if (!userCtx.user.loggedIn) {
      stopPulling();
      return;
    }
    allowStartPulling();
    pullNotifications()
      .catch(doNothing)
      .finally(() => startPulling());
  }, [userCtx.user.loggedIn]);

  useEffect(() => {
    if (!userCtx.user.loggedIn || !notifications.length) return;
    const unSeenNotifications = notifications.filter(
      n => !n.seenBy.find(user => user.uid === userCtx.user.localId),
    );
    if (!unSeenNotifications.length) return;

    toastCtx.setMessage({
      text: `You have ${unSeenNotifications.length} notifications`,
      type: messageTypes.notification,
    });
  }, [notifications]);

  const notificationsCtxValue = useMemo(
    () => ({
      notifications,
      pullNotifications,
      updateNotifications,
      deleteNotification,
    }),
    [deleteNotification, notifications, pullNotifications, updateNotifications],
  );

  return (
    <NotificationsContext.Provider value={notificationsCtxValue}>
      {children}
    </NotificationsContext.Provider>
  );
};
