import { StyleSheet, View } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

type DayCellActivityT = {
  isMyWorkDay?: boolean;
  isCurrentDay?: boolean;
  isAnyEmployeeWorkDay?: boolean;
};

const DayCellActivity: React.VFC<DayCellActivityT> = ({
  isMyWorkDay,
  isCurrentDay,
  isAnyEmployeeWorkDay,
}) => {
  return (
    <View style={styles.container}>
      {!!isMyWorkDay && (
        <View
          style={[
            styles.bar,
            { backgroundColor: Colors.defaultColors.myWorkDays },
          ]}
        />
      )}
      {!!isAnyEmployeeWorkDay && (
        <View
          style={[
            styles.bar,
            { backgroundColor: Colors.defaultColors.anyEmployeeWorkDay },
          ]}
        />
      )}
      {!!isCurrentDay && (
        <View
          style={[
            styles.bar,
            { backgroundColor: Colors.defaultColors.currentDay },
          ]}
        />
      )}
    </View>
  );
};

export default DayCellActivity;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 5,
    width: "100%",
  },
  bar: { flex: 1 },
});
