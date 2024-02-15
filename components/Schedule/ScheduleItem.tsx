import { StyleSheet, Text } from "react-native";
import React from "react";
import { EnrichedUserScheduleT } from "../../mw/mappers/scheduleMapper";
import Card from "../Card";
import Colors from "../../constants/Colors";

type ScheduleItemT = {
  data: EnrichedUserScheduleT;
};

const ScheduleItem: React.VFC<ScheduleItemT> = ({ data }) => {
  return (
    <Card style={{ width: "100%", marginVertical: 5 }}>
      <Text style={styles.text}>{`E-mail: ${data.userName}`}</Text>
      <Text
        style={styles.text}>{`Od: ${data.dateFrom} Do: ${data.dateTo}`}</Text>
    </Card>
  );
};

export default ScheduleItem;

const styles = StyleSheet.create({
  text: {
    color: Colors.defaultColors.text,
    fontSize: 16,
  },
});
