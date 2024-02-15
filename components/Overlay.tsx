/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { BlackPortal } from "react-native-portal";

type OverlayProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

//TODO: Create own Portal library for react native
const Overlay: FC<OverlayProps> = ({ onPress, style, children }) => {
  return (
    //@ts-ignore
    <BlackPortal name="overlay">
      <View style={styles.overlay}>
        <Pressable style={[styles.overlay, style]} onPress={onPress} />
        {children}
      </View>
    </BlackPortal>
  );
};

export default Overlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
