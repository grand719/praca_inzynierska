import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import DayCellActivity from "./DayCellActivity";
import { EnrichedUserScheduleT } from "../../mw/mappers/scheduleMapper";

type DayCellT = {
  date: Date;
  size: number;
  isPrevMonth: boolean;
  data: EnrichedUserScheduleT[];
  isMyWorkDay?: boolean;
  isCurrentDay?: boolean;
  isAnyEmployeeWorkDay?: boolean;
  onPress?: (data: EnrichedUserScheduleT[]) => void;
};

const DayCell: React.VFC<DayCellT> = ({
  date,
  size,
  isPrevMonth,
  isMyWorkDay,
  isCurrentDay,
  isAnyEmployeeWorkDay,
  data,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress?.bind(this, data)}>
      <View
        style={[
          { width: size - 8, height: size - 8, margin: 4 },
          styles.container,
          !isPrevMonth && styles.prevMonth,
        ]}>
        <Text style={[{ fontSize: Math.round(size * 0.6) }, styles.font]}>
          {date.getDate()}
        </Text>
        <DayCellActivity
          isMyWorkDay={isMyWorkDay}
          isAnyEmployeeWorkDay={isAnyEmployeeWorkDay}
          isCurrentDay={isCurrentDay}
        />
      </View>
    </Pressable>
  );
};

export default DayCell;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultColors.backGround,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.defaultColors.border,
    overflow: "hidden",
  },
  prevMonth: {
    opacity: 0.6,
  },
  font: {
    color: Colors.defaultColors.text,
  },
});
