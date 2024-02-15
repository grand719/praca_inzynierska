import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

const options = [
  {
    color: Colors.defaultColors.anyEmployeeWorkDay,
    description: "Dni pracy innych pracowników",
  },
  {
    color: Colors.defaultColors.currentDay,
    description: "Dzisiaj",
  },
  {
    color: Colors.defaultColors.myWorkDays,
    description: "Moje dni pracy",
  },
];

type OptionT = {
  option: {
    color: string;
    description: string;
  };
  fontSize: number;
};

const Option: React.VFC<OptionT> = ({ option, fontSize }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: fontSize,
          height: fontSize,
          borderRadius: fontSize,
          backgroundColor: option.color,
          marginHorizontal: 5,
        }}
      />
      <Text style={{ color: Colors.defaultColors.text, fontSize: fontSize }}>
        {option.description}
      </Text>
    </View>
  );
};

const DateContainerFooter = () => {
  return (
    <View style={styles.container}>
      {options.map(option => (
        <Option option={option} fontSize={12} key={option.description} />
      ))}
    </View>
  );
};

export default DateContainerFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
