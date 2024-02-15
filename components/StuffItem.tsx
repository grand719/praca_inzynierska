import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Title, { titleSize } from "./Title";
import { MappedStuffItemT } from "../mw/requesters/RDBRequester";
import Button from "./Form/Button";
import Colors from "../constants/Colors";
import Card from "./Card";
import ConfirmPopup from "./ConfirmPopup";
import { useToggle } from "../hooks/useToggle";

type StuffItemProps = {
  data: MappedStuffItemT;
  onRemovePress: () => void;
  onUpdatePress: () => void;
};

const StuffItem = ({ data, onRemovePress, onUpdatePress }: StuffItemProps) => {
  const { toggle, toggleSwitch } = useToggle(false);
  return (
    <>
      <Card>
        <Title size={titleSize.medium}>{data.name}</Title>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: Colors.defaultColors.text,
            paddingBottom: 20,
            marginBottom: 20,
          }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 4,
            }}>
            <View>
              <Text style={styles.text}>Typ: {data.stuffType.name}</Text>
            </View>
            <View>
              <Text style={styles.text}>{`Wypożyczalny: ${
                data.stuffType.rentable ? "Tak" : "Nie"
              }`}</Text>
              <Text style={styles.text}>Cena za 1h: {data.price} zł</Text>
            </View>
          </View>
          <Text style={styles.text}>Opis: {data.description}</Text>
        </View>
        <View>
          <Button
            disabled={false}
            onPress={onUpdatePress}
            buttonText="Edytuj"
          />
          <Button
            disabled={false}
            onPress={() => toggleSwitch()}
            buttonText="Usuń"
          />
        </View>
      </Card>
      {toggle && (
        <ConfirmPopup
          title={"Usuń przedmiot: " + data.name}
          onSubmit={() => {
            onRemovePress();
            toggleSwitch();
          }}
          onCancel={toggleSwitch}
        />
      )}
    </>
  );
};

export default StuffItem;

const styles = StyleSheet.create({
  text: {
    color: Colors.defaultColors.text,
    fontSize: 18,
    paddingVertical: 2,
  },
});
