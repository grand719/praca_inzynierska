import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { VFC, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Card from "../Card";
import Colors from "../../constants/Colors";
import Button from "./Button";
import { actionDataType } from "./Formhooks/form-hook";
import Input, { InputEnum } from "./Input";
import { useToggle } from "../../hooks/useToggle";
import Overlay from "../Overlay";
import { doNothing } from "../../utils/helper";

const hoursArray = new Array(16).fill(0).map((_, i) => {
  if (i + 1 + 7 < 10) return `0${i + 1 + 7}`;
  return `${i + 1 + 7}`;
});
const minutesArray = new Array(60).fill(0).map((_, i) => {
  if (i < 10) return `0${i}`;
  return `${i}`;
});

const cellSize = 80;

type TimePickerProps = {
  id: string;
  labelText: string;
  placeholder: string;
  onChange: (id: string, data: actionDataType) => void;
  isValid: boolean;
  timeValue: string;
};

const NewTimePicker: VFC<TimePickerProps> = ({
  id,
  labelText,
  placeholder,
  onChange,
  isValid,
  timeValue,
}) => {
  const hoursPositionRef = useRef(0);
  const minutesPositionRef = useRef(0);
  const [isScrollActive, setIsScrollActive] = useState(false);

  const { toggle, toggleSwitch } = useToggle(false);

  const onSubmit = () => {
    const time = `${hoursArray[hoursPositionRef.current / cellSize]}:${
      minutesArray[minutesPositionRef.current / cellSize]
    }`;
    const data = {
      validate: true,
      value: time,
    };
    onChange(id, data);
    toggleSwitch();
  };

  return (
    <>
      <Input
        id={id}
        type={InputEnum.DATE}
        onFocus={toggleSwitch}
        labelText={labelText}
        onChange={doNothing}
        placeholder={placeholder}
        isValidate={isValid}
        validators={[]}
        value={timeValue}
      />
      {toggle && (
        <Overlay
          onPress={toggleSwitch}
          style={{ backgroundColor: Colors.defaultColors.blackWithAlpha }}>
          <Card
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "70%",
            }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}>
              <View style={styles.scrollViewWrapper}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  snapToOffsets={hoursArray.map((_, index) => index * cellSize)}
                  scrollEventThrottle={0}
                  onMomentumScrollEnd={() => {
                    setIsScrollActive(false);
                  }}
                  onMomentumScrollBegin={() => {
                    setIsScrollActive(true);
                  }}
                  onScroll={(
                    event: NativeSyntheticEvent<NativeScrollEvent>,
                  ) => {
                    hoursPositionRef.current =
                      event.nativeEvent.contentOffset.y;
                  }}>
                  {hoursArray.map(value => {
                    return (
                      <View style={styles.textWrapper} key={value}>
                        <Text style={styles.textStyle}>{value}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={styles.separator}>
                <Text style={styles.textStyle}>:</Text>
              </View>
              <View style={styles.scrollViewWrapper}>
                <ScrollView
                  snapToOffsets={minutesArray.map(
                    (_, index) => index * cellSize,
                  )}
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={0}
                  onMomentumScrollEnd={() => {
                    setIsScrollActive(false);
                  }}
                  onMomentumScrollBegin={() => {
                    setIsScrollActive(true);
                  }}
                  onScroll={(
                    event: NativeSyntheticEvent<NativeScrollEvent>,
                  ) => {
                    minutesPositionRef.current =
                      event.nativeEvent.contentOffset.y;
                  }}>
                  {minutesArray.map(value => (
                    <View style={styles.textWrapper} key={value}>
                      <Text style={styles.textStyle}>{value}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={{ width: "90%", paddingTop: 10 }}>
              <Button
                disabled={isScrollActive}
                buttonText="Select"
                onPress={onSubmit}
              />
            </View>
          </Card>
        </Overlay>
      )}
    </>
  );
};

export default NewTimePicker;

const styles = StyleSheet.create({
  scrollViewWrapper: {
    height: cellSize,
  },
  separator: {
    height: cellSize,
    width: 20,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    justifyContent: "center",
  },
  textStyle: {
    fontSize: cellSize / 2,
    lineHeight: cellSize,
    color: Colors.defaultColors.text,
  },
});
