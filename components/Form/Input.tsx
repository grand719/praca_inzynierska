import numeral from "numeral";
import { forwardRef, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  StyleSheet,
  Pressable,
} from "react-native";

import Colors from "../../constants/Colors";
import IconButton from "../DatePicker/components/IconButton";

export enum InputEnum {
  TEXT,
  NUMBER,
  DATE,
  PASSWORD,
  EMAIL,
  SELECT,
}

type InputType = {
  id: string;
  type: InputEnum;
  labelText: string;
  onChange: (id: string, data: any) => void;
  onFocus?: () => void;
  onButtonPress?: () => void;
  placeholder: string;
  isValidate: boolean;
  validators: any[];
  value?: string;
  currency?: boolean;
};

const Input = forwardRef<TextInput, InputType>(
  (
    {
      id,
      type,
      labelText,
      onChange,
      onFocus,
      onButtonPress,
      placeholder,
      isValidate,
      validators,
      value,
      currency,
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState<any>("");
    const isFocused = useRef(false);

    const onChangeHandler = (
      event: NativeSyntheticEvent<TextInputChangeEventData>,
    ) => {
      let isValid = true;
      const value = event.nativeEvent.text;
      setInputValue(value);

      validators.forEach(validator => {
        if (validator(value)) {
          isValid = false;
        } else {
          isValid = true;
        }
      });
      if (InputEnum.NUMBER === type) {
        onChange(id, {
          value: +value,
          validate: isValid,
        });
      }

      onChange(id, { value: value, validate: isValid });
    };

    const onChangeSelectHandler = (
      event: NativeSyntheticEvent<TextInputChangeEventData>,
    ) => {
      setInputValue(event.nativeEvent.text);
      onChange(id, event.nativeEvent.text);
    };

    function onFocusHandler() {
      isFocused.current = true;
      if (onFocus) {
        onFocus();
      }

      if (currency) {
        setInputValue(value?.toString());
      }
    }

    function onLostFocus(
      event: NativeSyntheticEvent<TextInputChangeEventData>,
    ) {
      isFocused.current = false;
      setInputValue(
        numeral(parseFloat(value!.toString())).format("0,0[.]00") + " zł",
      );
    }

    useEffect(() => {
      if (type === InputEnum.NUMBER && !isFocused.current) {
        setInputValue(
          numeral(parseFloat(value!.toString())).format("0,0[.]00") + " zł",
        );
      }
    }, [type, value]);

    const textInput = () => {
      switch (type) {
        case InputEnum.TEXT:
          return (
            <TextInput
              style={styles.input}
              value={value}
              onChange={onChangeHandler}
              placeholder={placeholder}
              keyboardType="default"
              allowFontScaling
            />
          );
        case InputEnum.DATE:
          return (
            <>
              <TextInput
                style={styles.input}
                value={value}
                editable={false}
                placeholder={placeholder}
                keyboardType="default"
                allowFontScaling
              />
              <Pressable
                onPress={onFocusHandler}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  width: "100%",
                  height: "100%",
                }}
              />
            </>
          );
        case InputEnum.NUMBER:
          return (
            <TextInput
              style={styles.input}
              value={inputValue}
              onFocus={onFocusHandler}
              onBlur={onLostFocus}
              onChange={onChangeHandler}
              placeholder={placeholder}
              keyboardType="numeric"
            />
          );
        case InputEnum.PASSWORD:
          return (
            <TextInput
              style={styles.input}
              value={value}
              onChange={onChangeHandler}
              placeholder={placeholder}
              keyboardType="default"
              secureTextEntry={true}
            />
          );
        case InputEnum.EMAIL:
          return (
            <TextInput
              style={styles.input}
              value={value}
              onChange={onChangeHandler}
              placeholder={placeholder}
              keyboardType="email-address"
            />
          );
        case InputEnum.SELECT:
          return (
            <>
              <TextInput
                style={styles.input}
                value={value}
                editable={false}
                onChange={onChangeSelectHandler}
                ref={ref}
                placeholder={placeholder}
                keyboardType="default"
              />
              <Pressable
                onPress={onFocusHandler}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  width: "100%",
                  height: "100%",
                }}
              />
            </>
          );
        default:
          return (
            <TextInput
              style={styles.input}
              value={value}
              onChange={onChangeHandler}
              placeholder={placeholder}
              keyboardType="default"
            />
          );
      }
    };

    return (
      <View style={styles.inputWrapper}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{labelText}</Text>
        </View>
        <View style={[styles.inputContainer, !isValidate && styles.error]}>
          {textInput()}
          {!!onButtonPress && (
            <View style={styles.iconButtonContainer}>
              <IconButton
                icon="calendar-outline"
                size={36}
                color={Colors.defaultColors.text}
                onPress={() => {
                  onButtonPress();
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  },
);

export default Input;

const styles = StyleSheet.create({
  inputWrapper: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    backgroundColor: Colors.defaultColors.backGround,
    width: "100%",
    height: 50,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 2,
    borderColor: Colors.defaultColors.border,
    borderRadius: 50,
  },
  input: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    fontSize: 18,
    color: Colors.defaultColors.text,
  },
  textContainer: {
    padding: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.defaultColors.text,
  },
  error: {
    backgroundColor: Colors.defaultColors.error,
  },
  iconButtonContainer: {
    marginLeft: -60,
  },
});
