import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import IconButton from "../DatePicker/components/IconButton";

type DateContainerHeaderT = {
  title: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const DateContainerHeader: React.VFC<DateContainerHeaderT> = ({
  title,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-back-circle"
        size={40}
        onPress={onPrevMonth}
        color={Colors.defaultColors.text}
      />
      <Text style={styles.text}>{title}</Text>
      <IconButton
        icon="arrow-forward-circle"
        size={40}
        onPress={onNextMonth}
        color={Colors.defaultColors.text}
      />
    </View>
  );
};

export default DateContainerHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  text: {
    fontSize: 40,
    color: Colors.defaultColors.text,
    textAlign: "center",
  },
});
