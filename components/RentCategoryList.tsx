import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MappedStuffItemT } from "../mw/requesters/RDBRequester";
import RentCategoryListItem from "./RentCategoryListItem";

type RentCategoryListProps = {
  data: MappedStuffItemT[];
  openRentForm: (data: MappedStuffItemT) => void;
};

const RentCategoryList = ({ data, openRentForm }: RentCategoryListProps) => {
  return (
    <ScrollView>
      {data.map(item => (
        <RentCategoryListItem
          key={item.id}
          data={item}
          onPress={openRentForm}
        />
      ))}
    </ScrollView>
  );
};

export default RentCategoryList;
