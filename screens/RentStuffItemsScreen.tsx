import { View } from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ScreenGradient from "../components/ScreenGradient";
import {
  MappedStuffItemT,
  MappedStuffTypesT,
} from "../mw/requesters/RDBRequester";
import mw from "../mw/mw";
import {
  selectedStuffItemMapper,
  stuffMapper,
} from "../mw/mappers/stuffMapper";
import Log from "../logs/Log";
import { FlatList } from "react-native-gesture-handler";
import Button from "../components/Form/Button";
import Title from "../components/Title";
import {
  Transition,
  Transitioning,
  TransitioningView,
} from "react-native-reanimated";
import RentCategoryList from "../components/RentCategoryList";
import { useToggle } from "../hooks/useToggle";
import Modal from "../components/Modal";
import Colors from "../constants/Colors";
import RentForm from "../components/Form/RentForm";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/user-context";
import { RouteMap } from "../constants/Route";

const transition = (
  <Transition.Sequence>
    <Transition.Out type="slide-bottom" durationMs={200} />
    <Transition.Change interpolation="easeInOut" />
    <Transition.In type="slide-top" durationMs={200} />
  </Transition.Sequence>
);

const TAG = "RentStuffItemsScreen";

const RentStuffItemsScreen = () => {
  const { toggle, toggleSwitch } = useToggle(false);
  const [stuffTypes, setStuffTypes] = useState<MappedStuffTypesT[]>([]);
  const [stuffItems, setStuffItems] = useState<
    Record<string, MappedStuffItemT[]>
  >({});
  const [currentFocusedIndex, setCurrentFocusedIndex] = useState("");
  const [targetItem, setTargetItem] = useState<MappedStuffItemT>();
  const transitionRef = useRef<TransitioningView>(null);
  const userCtx = useContext(UserContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      mw.rdbRequester
        .getStuff()
        .then(data => {
          const mappedData = stuffMapper(data);
          setStuffTypes(mappedData);
        })
        .catch(error => {
          Log.error(TAG, "Failed to get stuff types", error);
        });
    } else {
      setStuffItems({});
    }
  }, [isFocused]);

  const fetchCategory = useCallback(
    (stuffName: string, forceFetch?: boolean) => {
      if (stuffItems === undefined && !forceFetch) return;

      if (stuffItems[stuffName] && !forceFetch) return;

      mw.rdbRequester
        .getSelectedStuffItems(stuffName)
        .then(data => {
          const mappedData = selectedStuffItemMapper(data);
          setStuffItems(prevData => ({
            ...prevData,
            [stuffName]: mappedData,
          }));
        })
        .catch(error => {
          Log.error(TAG, "Failed to get stuff items", error);
        });
    },
    [stuffItems],
  );

  const onRentHandler = useCallback(
    (targetItemData: MappedStuffItemT) => {
      setTargetItem(targetItemData);
      toggleSwitch();
    },
    [toggleSwitch],
  );

  const onReservationScreenNavigate = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    navigation.navigate(RouteMap.RESERVATION_DETAILS);
  }, [navigation]);

  return (
    <ScreenGradient>
      {userCtx.user.loggedIn ? (
        <Button
          buttonText="Detale rezerwacji"
          onPress={onReservationScreenNavigate}
          disabled={false}
        />
      ) : (
        <Title>Wypożycz</Title>
      )}
      <Transitioning.View transition={transition} ref={transitionRef}>
        <FlatList
          data={stuffTypes}
          contentContainerStyle={{
            margin: 4,
            flexShrink: 0,
          }}
          renderItem={item => {
            if (!item.item.rentable) return null;
            return (
              <View>
                <Button
                  buttonText={item.item.name}
                  onPress={() => {
                    transitionRef.current?.animateNextTransition();
                    if (currentFocusedIndex === item.item.id) {
                      setCurrentFocusedIndex("");
                      return;
                    }
                    setCurrentFocusedIndex(item.item.id);
                    fetchCategory(item.item.name);
                  }}
                  disabled={false}
                  shouldBeRounded={false}
                />
                {item.item.id === currentFocusedIndex && (
                  <RentCategoryList
                    openRentForm={onRentHandler}
                    data={
                      stuffItems[item.item.name]
                        ? stuffItems[item.item.name]
                        : []
                    }
                  />
                )}
              </View>
            );
          }}
        />
      </Transitioning.View>
      {toggle && (
        <Modal
          onPress={toggleSwitch}
          style={{ backgroundColor: Colors.defaultColors.blackWithAlpha }}>
          <RentForm
            targetItemData={targetItem}
            refresh={fetchCategory}
            closeModal={toggleSwitch}
          />
        </Modal>
      )}
    </ScreenGradient>
  );
};

export default RentStuffItemsScreen;
