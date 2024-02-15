import { View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Title, { titleSize } from "../components/Title";
import { MappedStuffItemT } from "../mw/requesters/RDBRequester";
import mw from "../mw/mw";
import { stuffItemMapper } from "../mw/mappers/stuffMapper";
import Log from "../logs/Log";
import StuffItem from "../components/StuffItem";
import { FlatList } from "react-native-gesture-handler";
import Modal from "../components/Modal";
import { useToggle } from "../hooks/useToggle";
import Colors from "../constants/Colors";
import Card from "../components/Card";
import StuffItemUpdateForm from "../components/Form/StuffItemUpdateForm";
import { ToastContex, messageTypes } from "../context/toast-contex";

const TAG = "StuffItemsScreen";

const StuffItemsScreen = () => {
  const toastCtx = useContext(ToastContex);
  const { toggle, toggleSwitch } = useToggle(false);
  const [stuffItem, setStuffItem] = useState<MappedStuffItemT>();

  const [stuffItems, setStuffItems] = useState<MappedStuffItemT[]>([]);

  const fetchItems = useCallback(() => {
    mw.rdbRequester
      .getStuffItems()
      .then(items => {
        const mappedItems = stuffItemMapper(items);
        setStuffItems(mappedItems);
        toastCtx.setMessage({
          text: "Przedmioty pobrane",
          type: messageTypes.confirm,
        });
      })
      .catch(error => {
        Log.error(TAG, "Failed to fetch stuff items error: ", error);
        toastCtx.setMessage({
          text: "Błąd podczas pobierania",
          type: messageTypes.error,
        });
      });
  }, [toastCtx]);

  useEffect(() => {
    fetchItems();
  }, []);

  const onItemRemove = useCallback(
    (id: string, typeName: string) => {
      mw.rdbRequester
        .deleteStuffItem(id, typeName)
        .then(() => {
          fetchItems();
          toastCtx.setMessage({
            text: "Przedmiot usunięty",
            type: messageTypes.confirm,
          });
        })
        .catch(error => {
          Log.error(TAG, "Failed to remove stuff item", error);
          toastCtx.setMessage({
            text: "Błąd podczas usuwania",
            type: messageTypes.confirm,
          });
        });
    },
    [fetchItems, toastCtx],
  );

  return (
    <>
      <Title size={titleSize.medium}>Przedmioty</Title>
      <FlatList
        data={stuffItems}
        renderItem={({ item }: { item: MappedStuffItemT }) => {
          return (
            <StuffItem
              data={item}
              onRemovePress={() => {
                onItemRemove(item.id, item.stuffType.name);
              }}
              onUpdatePress={() => {
                toggleSwitch();
                setStuffItem(item);
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
            <StuffItemUpdateForm
              defaultData={stuffItem}
              closeModal={toggleSwitch}
              onEditEnd={fetchItems}
            />
          </Card>
        </Modal>
      )}
    </>
  );
};

export default StuffItemsScreen;
