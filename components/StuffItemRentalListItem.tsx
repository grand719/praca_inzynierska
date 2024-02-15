import { View, Text } from "react-native";
import React from "react";
import { StuffRentalT } from "../mw/requesters/RDBRequester";
import Colors from "../constants/Colors";

type StuffItemRentalListItemProps = {
  data: StuffRentalT;
};

const StuffItemRentalListItem = ({ data }: StuffItemRentalListItemProps) => {
  return (
    <View
      style={{
        width: "100%",
        height: 38,
        backgroundColor: Colors.defaultColors.backGround,
        borderWidth: 1,
        borderColor: Colors.defaultColors.border,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 4,
        justifyContent: "center",
        paddingHorizontal: 6,
        marginVertical: 4,
      }}>
      <Text
        style={{
          color: Colors.defaultColors.text,
          fontSize: 16,
        }}>{`Od ${new Date(data.startRent).getHours()} Do: ${new Date(
        data.endRent,
      ).getHours()}`}</Text>
    </View>
  );
};

export default StuffItemRentalListItem;
