import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React, { ReactNode } from "react";
import { BlackPortal } from "react-native-portal";

type ModalProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ style, children, onPress }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <BlackPortal name="modal">
      <View style={styles.modal}>
        <Pressable style={[styles.modal, style]} onPress={onPress} />
        {children}
      </View>
    </BlackPortal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
