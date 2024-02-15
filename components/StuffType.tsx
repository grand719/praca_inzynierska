import { View, Text } from "react-native";
import React from "react";
import Card from "./Card";
import { MappedStuffTypesT } from "../mw/requesters/RDBRequester";
import Title, { titleSize } from "./Title";
import Button from "./Form/Button";
import { useToggle } from "../hooks/useToggle";
import ConfirmPopup from "./ConfirmPopup";

type StuffTypeParams = {
  data: MappedStuffTypesT;
  onEdit: () => void;
  onRemove: () => void;
};

const StuffType = ({ data, onEdit, onRemove }: StuffTypeParams) => {
  const { toggle, toggleSwitch } = useToggle(false);
  return (
    <>
      <Card>
        <Title size={titleSize.medium}>{data.name}</Title>
        <Title size={titleSize.small}>
          Wypożyczalny: {data.rentable ? "Tak" : "Nie"}
        </Title>
        <View>
          {/* <Button disabled={false} buttonText="Edit" onPress={onEdit} /> */}
          <Button disabled={false} buttonText="Usuń" onPress={toggleSwitch} />
        </View>
      </Card>
      {toggle && (
        <ConfirmPopup
          title={
            "Jesteś pewny, ze chcesz usunąć: " +
            data.name +
            " usunie to tez wszystkie powiązane przedmioty"
          }
          onSubmit={() => {
            onRemove();
            toggleSwitch();
          }}
          onCancel={toggleSwitch}
        />
      )}
    </>
  );
};

export default StuffType;
