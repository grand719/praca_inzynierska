import { View, Text, LayoutChangeEvent, Pressable } from "react-native";
import React, {
  VFC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MappedNotificationT } from "../mw/requesters/RDBRequester";
import Card from "./Card";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Colors from "../constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import { NotificationsContext } from "../context/notifacations-context";
import { useToggle } from "../hooks/useToggle";
import Overlay from "./Overlay";
import Title from "./Title";
import IconButton from "./DatePicker/components/IconButton";
import LoadingSpinner from "./LoadingSpinner";

type NotificationType = {
  notification: MappedNotificationT;
  isSeen: boolean;
  isAdmin: boolean;
};

type PulseComponentT = {
  size: { width: number; height: number };
};

const PulseComponent: VFC<PulseComponentT> = ({ size }) => {
  const scaleValue = useSharedValue(0);

  useEffect(() => {
    scaleValue.value = 0;
    scaleValue.value = withRepeat(withTiming(1, { duration: 2000 }), -1, false);
  });

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(size.width ** 2 + size.height ** 2);
    return {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      position: "absolute",
      width: circleRadius * 2,
      height: circleRadius * 2,
      top: -circleRadius + size.height / 2,
      left: -circleRadius / 2,
      transform: [{ scale: scaleValue.value }],
      borderRadius: circleRadius,
    };
  }, []);

  return <Animated.View style={[rStyle]} />;
};

type NotificationDetailsT = {
  notification: MappedNotificationT;
};

const NotificationDetails: VFC<NotificationDetailsT> = ({ notification }) => {
  return (
    <Card
      style={{
        width: "80%",
        flexDirection: "column",
      }}>
      <View
        style={{
          borderBottomWidth: 2,
          borderColor: Colors.defaultColors.text,
        }}>
        <Title>{notification.title}</Title>
      </View>
      <View
        style={{
          paddingVertical: 10,
          borderBottomWidth: 2,
          borderColor: Colors.defaultColors.text,
        }}>
        <Text style={{ fontSize: 16, color: Colors.defaultColors.text }}>
          {notification.message}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          color: Colors.defaultColors.text,
          marginTop: 10,
        }}>
        Seen by:
      </Text>
      <ScrollView style={{ marginTop: 4 }}>
        {notification.seenBy.map(user => (
          <Text
            key={user.uid}
            style={{
              fontSize: 12,
              color: Colors.defaultColors.text,
              marginRight: 2,
            }}>
            {user.userName}
          </Text>
        ))}
      </ScrollView>
    </Card>
  );
};

const Notification: VFC<NotificationType> = ({
  notification,
  isSeen,
  isAdmin,
}) => {
  const [size, setSize] = useState<
    { width: number; height: number } | undefined
  >();

  const { toggle, toggleSwitch } = useToggle(false);
  const [isLoading, setIsLoading] = useState(false);

  const notificationCtx = useContext(NotificationsContext);

  const onLayoutChange = (event: LayoutChangeEvent) => {
    setSize({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  const onDeletePress = useCallback(() => {
    setIsLoading(true);
    notificationCtx
      .deleteNotification(notification.id)
      .then(() => {
        setIsLoading(false);
      })
      .catch(_e => setIsLoading(false));
  }, [notification.id, notificationCtx]);

  const onNotificationPress = useCallback(() => {
    toggleSwitch();
    if (isSeen) return;
    notificationCtx.updateNotifications(notification);
  }, [isSeen, notification, notificationCtx, toggleSwitch]);

  return (
    <>
      <Card
        style={{ overflow: "hidden", flexDirection: "row" }}
        onLayout={onLayoutChange}>
        {!isSeen && !!size && <PulseComponent size={size} />}
        <Pressable style={{ flex: 1 }} onPress={onNotificationPress}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text
              style={{ fontSize: 20, color: Colors.defaultColors.text }}
              numberOfLines={1}>
              {notification.title}
            </Text>
            <Text
              style={{ fontSize: 12, color: Colors.defaultColors.text }}
              numberOfLines={2}>
              {notification.message}
            </Text>
          </View>
        </Pressable>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {!isSeen && (
            <Text style={{ fontSize: 18, color: Colors.defaultColors.text }}>
              New!
            </Text>
          )}
          {isAdmin && (
            <IconButton
              icon={"close-circle-outline"}
              size={22}
              color={Colors.defaultColors.text}
              onPress={onDeletePress}
            />
          )}
        </View>
      </Card>
      <LoadingSpinner isLoading={isLoading} />
      {toggle && (
        <Overlay
          onPress={toggleSwitch}
          style={{ backgroundColor: Colors.defaultColors.blackWithAlpha }}>
          <NotificationDetails notification={notification} />
        </Overlay>
      )}
    </>
  );
};

export default Notification;
