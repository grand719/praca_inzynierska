import ScreenGradient from "../components/ScreenGradient";
import { useContext } from "react";
import { NotificationsContext } from "../context/notifacations-context";
import Notification from "../components/Notification";
import { UserContext } from "../context/user-context";
import { FlatList } from "react-native-gesture-handler";
import Button from "../components/Form/Button";
import { useToggle } from "../hooks/useToggle";
import Overlay from "../components/Overlay";
import NotificationForm from "../components/Form/NotificationForm";
import Colors from "../constants/Colors";

function NotificationsScreen() {
  const notificationCtx = useContext(NotificationsContext);
  const userCtx = useContext(UserContext);
  const { toggle, toggleSwitch } = useToggle(false);

  return (
    <ScreenGradient>
      {userCtx.user.role === "admin" && (
        <Button
          disabled={false}
          onPress={toggleSwitch}
          buttonText={"Wyślij powiadomienie"}
        />
      )}
      {toggle && (
        <Overlay
          style={{ backgroundColor: Colors.defaultColors.blackWithAlpha }}
          onPress={toggleSwitch}>
          <NotificationForm toggleSwitch={toggleSwitch} />
        </Overlay>
      )}
      <FlatList
        data={notificationCtx.notifications}
        renderItem={({ item }) => {
          const isSeen = item.seenBy.find(
            user => user.uid === userCtx.user.localId,
          );
          return (
            <Notification
              isAdmin={userCtx.user.role === "admin"}
              notification={item}
              isSeen={!!isSeen}
            />
          );
        }}
      />
    </ScreenGradient>
  );
}

export default NotificationsScreen;
