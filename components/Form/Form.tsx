import { ReactNode, FC } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import Colors from "../../constants/Colors";

type FormProps = {
  inputs: ReactNode;
  buttons?: ReactNode;
  subButtons?: ReactNode;
};

const From: FC<FormProps> = ({ inputs, buttons, subButtons }) => {
  return (
    <ScrollView style={styles.scrollViewWrapper}>
      <View style={styles.wrapper}>
        <View>{inputs}</View>
        <View style={styles.buttonContainer}>
          {buttons}
          <View style={styles.line} />
          {subButtons && subButtons}
        </View>
      </View>
    </ScrollView>
  );
};

export default From;

const styles = StyleSheet.create({
  scrollViewWrapper: {
    flex: 1,
  },
  wrapper: {
    flexDirection: "column",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  line: {
    width: "100%",
    height: 1,
    borderBottomWidth: 2,
    borderBottomColor: Colors.defaultColors.text,
    marginVertical: 20,
  },
});
