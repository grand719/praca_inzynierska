import { View, Text } from "react-native";
import React, { useCallback } from "react";
import { MappedStuffItemT } from "../mw/requesters/RDBRequester";
import Button from "./Form/Button";

type RentCategoryListItemProps = {
  data: MappedStuffItemT;
  onPress: (itemData: MappedStuffItemT) => void;
};

const RentCategoryListItem = ({ data, onPress }: RentCategoryListItemProps) => {
  const onPressHandler = useCallback(() => {
    onPress(data);
  }, [data, onPress]);
  return (
    <View style={{ marginHorizontal: 6 }}>
      <Button
        buttonText={`${data.name} - ${data.price}zł`}
        onPress={onPressHandler}
        disabled={false}
        shouldBeRounded={false}
      />
    </View>
  );
};

export default RentCategoryListItem;
