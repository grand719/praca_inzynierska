import { FC, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

export const titleSize = {
  big: 40,
  medium: 25,
  small: 16,
};

type TitleType = {
  children: ReactNode;
  size?: number;
};

const Title: FC<TitleType> = ({ children, size = titleSize.big }) => {
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.textTitle,
          { fontSize: size, marginBottom: size * 1.5 },
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
  },
  textTitle: {
    marginTop: 25,
    fontWeight: "bold",
    color: Colors.defaultColors.text,
  },
});
