import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useHeaderHeight } from "@react-navigation/elements";

import Colors from "../constants/Colors";

type ScreenContainerType = {
  children: ReactNode;
};

const ScreenGradient: FC<ScreenContainerType> = ({ children }) => {
  const headerHeight = useHeaderHeight();
  return (
    <LinearGradient
      colors={[
        Colors.defaultColors.backGround,
        Colors.defaultColors.border,
        Colors.defaultColors.focus,
      ]}
      style={[styles.container, { paddingTop: headerHeight }]}>
      {children}
    </LinearGradient>
  );
};

export default ScreenGradient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
