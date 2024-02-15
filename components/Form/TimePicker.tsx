import { useState, VFC } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from "react-native";

import { useToggle } from "../../hooks/useToggle";
import Colors from "../../constants/Colors";
import { doNothing } from "../../utils/helper";

import Overlay from "../Overlay";
import Input, { InputEnum } from "./Input";
import Button from "./Button";
import { actionDataType } from "./Formhooks/form-hook";

type TimePickerProps = {
  id: string;
  labelText: string;
  placeholder: string;
  onChange: (id: string, data: actionDataType) => void;
  isValid: boolean;
  timeValue: string;
};

const TimePicker: VFC<TimePickerProps> = ({
  id,
  labelText,
  placeholder,
  isValid,
  onChange,
  timeValue,
}) => {
  const { toggle, toggleSwitch } = useToggle(false);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");

  const onHoursChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    const eventValue = +event.nativeEvent.text;
    let value = "";

    if (eventValue < 10 && eventValue >= 0) {
      value = `0${eventValue}`;
      setHours(value);
      return;
    }

    if (eventValue >= 10 && eventValue < 24) {
      value = `${eventValue}`;
      setHours(value);
      return;
    } else {
      return;
    }
  };

  const onMinutesChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    const eventValue = +event.nativeEvent.text;
    let value = "";

    if (eventValue < 10 && eventValue >= 0) {
      value = `0${eventValue}`;
      setMinutes(value);
      return;
    }

    if (eventValue >= 10 && eventValue < 60) {
      value = `${eventValue}`;
      setMinutes(value);
      return;
    } else {
      return;
    }
  };

  const onSubmit = () => {
    const time = `${hours}:${minutes}`;
    const data = {
      validate: true,
      value: time,
    };
    toggleSwitch();
    onChange(id, data);
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
        <Overlay onPress={toggleSwitch} style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <TextInput
                value={hours}
                onChange={onHoursChange}
                style={styles.button}
                keyboardType="numeric"
              />
              <View style={styles.separator}>
                <Text style={styles.separatorText}>:</Text>
              </View>
              <TextInput
                value={minutes}
                onChange={onMinutesChange}
                style={styles.button}
                keyboardType="numeric"
              />
            </View>
            <View style={{ padding: 10, width: "100%" }}>
              <Button disabled={false} buttonText="Ok" onPress={onSubmit} />
            </View>
          </View>
        </Overlay>
      )}
    </>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.defaultColors.backGround,
    borderColor: Colors.defaultColors.border,
    borderRadius: 15,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
    marginTop: 40,
  },
  button: {
    height: 30,
    width: 50,
    borderColor: Colors.defaultColors.text,
    borderBottomWidth: 4,
    fontSize: 28,
    color: Colors.defaultColors.text,
    textAlign: "center",
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.defaultColors.blackWithAlpha,
  },
  separator: {
    paddingHorizontal: 6,
  },
  separatorText: {
    fontSize: 30,
    color: Colors.defaultColors.text,
  },
});
