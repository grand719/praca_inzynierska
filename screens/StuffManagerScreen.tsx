/* eslint-disable @typescript-eslint/ban-ts-comment */
import { View, StyleSheet } from "react-native";
import ScreenGradient from "../components/ScreenGradient";
import Button from "../components/Form/Button";
import { getRouteHeaders, StuffManagerRouteMap } from "../constants/Route";
import { ScrollView } from "react-native-gesture-handler";
import AddStuffItemScreen from "./AddStuffItemScreen";
import AddStuffTypeScreen from "./AddStuffTypeScreen";
import StuffItemsScreen from "./StuffItemsScreen";
import StuffTypesScreen from "./StuffTypesScreen";
import { useState } from "react";

const screenMap = {
  [StuffManagerRouteMap.ADD_STUFF_ITEM_FORM]: <AddStuffItemScreen />,
  [StuffManagerRouteMap.ADD_STUFF_TYPE_FORM]: <AddStuffTypeScreen />,
  [StuffManagerRouteMap.STUFF_ITEMS]: <StuffItemsScreen />,
  [StuffManagerRouteMap.STUFF_TYPES]: <StuffTypesScreen />,
};

//@ts-ignore
function StuffManagerScreen({ navigation }) {
  const [screenToDisplay, setScreenToDisplay] = useState(
    StuffManagerRouteMap.ADD_STUFF_ITEM_FORM,
  );
  const options = Object.keys(StuffManagerRouteMap);
  function generateOptions() {
    return options.map((option, id) => {
      return (
        <View key={`${option}-${id}`} style={styles.buttonContainer}>
          <Button
            disabled={false}
            onPress={() => {
              setScreenToDisplay(
                StuffManagerRouteMap[
                  option as keyof typeof StuffManagerRouteMap
                ],
              );
            }}
            buttonText={getRouteHeaders(
              StuffManagerRouteMap[option as keyof typeof StuffManagerRouteMap],
            )}
          />
        </View>
      );
    });
  }

  return (
    <ScreenGradient>
      <ScrollView
        horizontal
        style={styles.optionsContainer}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {generateOptions()}
      </ScrollView>
      <View style={{ maxHeight: "80%" }}>{screenMap[screenToDisplay]}</View>
    </ScreenGradient>
  );
}

export default StuffManagerScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  optionsContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    flexGrow: 0,
    height: 75,
  },
});
