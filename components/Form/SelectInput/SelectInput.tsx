import {
  useState,
  useMemo,
  VFC,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { TextInput, View } from "react-native";

import Input, { InputEnum } from "../Input";
import { OptionProps } from "./Option";
import DropDown, { DropDownRefProps } from "./Dropdown";
import { actionDataType } from "../Formhooks/form-hook";

export type options = Omit<OptionProps, "style" | "textStyle" | "onSelect">;

type SelectInputProps = {
  id: string;
  options: options[];
  labelText: string;
  placeHolder: string;
  onSelect: (id: string, data: actionDataType) => void;
  isValid: boolean;
  shouldDisplayNameAsValue?: boolean;
  defaultValue?: options;
};

export type SelectInputRefProps = {
  resetValue: () => void;
};

const SelectInput = forwardRef<SelectInputRefProps, SelectInputProps>(
  (
    {
      id,
      options,
      onSelect,
      isValid,
      labelText,
      placeHolder,
      shouldDisplayNameAsValue,
      defaultValue,
    },
    ref,
  ) => {
    const [filter, setFilter] = useState<string>("");
    const selectInputRef = useRef<TextInput>(null);

    const dropDownRef = useRef<DropDownRefProps>(null);

    function filterData(id: string, data: string) {
      setFilter(data);
    }

    const optionFiltered = useMemo(() => {
      const newOptions = defaultValue
        ? [...options, defaultValue]
        : [...options];
      return newOptions.filter(option => option.value.includes(filter));
    }, [filter, options, defaultValue]);

    function onSelectHandler(value: string) {
      const foundOption = options.filter(option => option.value === value);
      const textToDisplay = shouldDisplayNameAsValue
        ? foundOption.length !== 0
          ? foundOption[0].name
          : value
        : value;
      selectInputRef.current?.setNativeProps({
        text: textToDisplay,
      });
      onSelect(id, { value: value, validate: !!value });
      dropDownRef.current?.closeModal();
    }

    function onPressHandler() {
      dropDownRef.current?.openModal();
    }

    const resetValue = useCallback(() => {
      const defValue = defaultValue
        ? defaultValue.value
        : optionFiltered[0].value;
      const foundOption = options.filter(option => option.value === defValue);
      const textToDisplay = shouldDisplayNameAsValue
        ? foundOption.length !== 0
          ? foundOption[0].name
          : defValue
        : defValue;
      selectInputRef.current?.setNativeProps({
        text: textToDisplay,
      });
      onSelect(id, { value: defValue, validate: !!defValue });
    }, [
      defaultValue,
      id,
      onSelect,
      optionFiltered,
      options,
      shouldDisplayNameAsValue,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        resetValue,
      }),
      [resetValue],
    );

    return (
      <View>
        <Input
          type={InputEnum.SELECT}
          id={id}
          labelText={labelText}
          onChange={filterData}
          placeholder={placeHolder}
          onFocus={onPressHandler}
          isValidate={isValid}
          validators={[]}
          ref={selectInputRef}
        />
        <DropDown
          ref={dropDownRef}
          options={optionFiltered}
          onSelect={onSelectHandler}
        />
      </View>
    );
  },
);

export default SelectInput;
