import { FlatList, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Title, { titleSize } from "../components/Title";
import StuffType from "../components/StuffType";
import { MappedStuffTypesT } from "../mw/requesters/RDBRequester";
import mw from "../mw/mw";
import { stuffMapper } from "../mw/mappers/stuffMapper";
import Log from "../logs/Log";
import { doNothing } from "../utils/helper";
import { useToggle } from "../hooks/useToggle";
import Card from "../components/Card";
import StuffTypeUpdateForm from "../components/Form/StuffTypeUpdateForm";
import Colors from "../constants/Colors";
import Modal from "../components/Modal";

const TAG = "StuffTypesScreen";

const StuffTypesScreen = () => {
  const [stuffTypes, setStuffTypes] = useState<MappedStuffTypesT[]>([]);
  const [selectedStuffType, setSelectedStuffType] =
    useState<MappedStuffTypesT>();

  const { toggle, toggleSwitch } = useToggle(false);

  const fetchItems = useCallback(() => {
    mw.rdbRequester
      .getStuff()
      .then(items => {
        const mappedItems = stuffMapper(items);
        setStuffTypes(mappedItems);
      })
      .catch(error => {
        Log.error(TAG, "Failed to fetch stuff types: ", error);
      });
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  const onRemove = useCallback((name: string, id: string) => {
    mw.rdbRequester.deleteStuffType(name, id).catch(error => {
      Log.error(TAG, "Failed to remove stuff type", error);
    });
  }, []);

  return (
    <>
      <Title size={titleSize.medium}>Typy przedmiotów</Title>
      <FlatList
        data={stuffTypes}
        style={{ flexGrow: 1 }}
        renderItem={({ item }: { item: MappedStuffTypesT }) => {
          return (
            <StuffType
              data={item}
              onRemove={() => {
                onRemove(item.name, item.id);
                fetchItems();
              }}
              onEdit={() => {
                setSelectedStuffType(item);
                toggleSwitch();
              }}
            />
          );
        }}
      />
      {toggle && (
        <Modal
          onPress={toggleSwitch}
          style={{ backgroundColor: Colors.defaultColors.blackWithAlpha }}>
          <Card style={{ maxHeight: "60%" }}>
            <StuffTypeUpdateForm
              defaultData={selectedStuffType}
              onEndEditing={() => {
                toggleSwitch();
                fetchItems();
              }}
            />
          </Card>
        </Modal>
      )}
    </>
  );
};

export default StuffTypesScreen;
