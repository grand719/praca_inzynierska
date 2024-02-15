/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FC, useCallback, useContext, useEffect, useMemo } from "react";

import {
  ToastContex,
  messageT,
  messageTypes,
} from "../../context/toast-contex";
import { View, Text, StyleSheet } from "react-native";
import IconButton from "../DatePicker/components/IconButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

type ToastT = {
  data: messageT;
};

const Toast: FC<ToastT> = ({ data }) => {
  const toastContext = useContext(ToastContex);

  const deleteToast = useCallback(() => {
    toastContext.removeMessage(data.id!);
  }, [data.id, toastContext]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      deleteToast();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [deleteToast]);

  const toastStyles = useMemo<{
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    textColor: string;
  }>(() => {
    return {
      icon: data.type === messageTypes.error ? "close" : "checkbox",
      color:
        data.type === messageTypes.notification
          ? Colors.defaultColors.backGround
          : data.type === messageTypes.error
          ? Colors.defaultColors.error
          : Colors.defaultColors.positive,
      textColor:
        data.type === messageTypes.notification
          ? Colors.defaultColors.text
          : data.type === messageTypes.error
          ? Colors.defaultColors.errorText
          : Colors.defaultColors.positiveText,
    };
  }, [data.type]);

  return (
    <View
      style={[
        {
          backgroundColor: toastStyles.color,
          borderColor: toastStyles.textColor,
        },
        styles.toast,
      ]}>
      <Text style={{ color: toastStyles.textColor }}>{data.text}</Text>
      <IconButton
        icon={toastStyles.icon}
        size={20}
        color={toastStyles.textColor}
        onPress={deleteToast}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    width: 350,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 2,
    margin: 2,
    borderRadius: 5,
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default Toast;
