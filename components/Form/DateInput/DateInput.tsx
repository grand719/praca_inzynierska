import { useState, FC } from "react";
import { View } from "react-native";

import { useToggle } from "../../../hooks/useToggle";
import { doNothing } from "../../../utils/helper";
import { actionDataType } from "../Formhooks/form-hook";
import Input, { InputEnum } from "../Input";
import DatePickerWithOverlay from "./DatePickerWithOverlay";

type DateInputProps = {
  value: string;
  isValid: boolean;
  labelName: string;
  id: string;
  onChange: (id: string, data: actionDataType) => void;
  disableWeekends?: boolean;
};

const DateInput: FC<DateInputProps> = ({
  value,
  isValid,
  labelName,
  id,
  onChange,
}) => {
  const dateForm = value.length > 0 ? new Date(value) : new Date();

  const [date, setDate] = useState<Date>(dateForm);
  const { toggle, toggleSwitch } = useToggle(false);

  function onDateSelectHandler(valueDate: Date) {
    setDate(valueDate);
    onChange(id, {
      validate: true,
      value: valueDate.toDateString(),
    });
    toggleSwitch();
  }

  return (
    <>
      <View>
        <Input
          id={id}
          onChange={doNothing}
          type={InputEnum.DATE}
          onFocus={toggleSwitch}
          labelText={labelName}
          placeholder="Data"
          isValidate={isValid}
          validators={[]}
          value={value}
          onButtonPress={toggleSwitch}
        />
      </View>
      <DatePickerWithOverlay
        isVisible={toggle}
        value={date}
        onClose={() => {
          toggleSwitch();
        }}
        onPress={onDateSelectHandler}
      />
    </>
  );
};

export default DateInput;
