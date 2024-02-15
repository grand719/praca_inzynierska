import { useContext, useState } from "react";
import { useForm } from "./Formhooks/form-hook";
import Input, { InputEnum } from "./Input";
import Button from "./Button";
import From from "./Form";
import validator from "../../utils/validator";
import DateInput from "./DateInput/DateInput";
import NewTimePicker from "./NewTimePicker";

import SelectInput from "./SelectInput/SelectInput";
import mw from "../../mw/mw";
import { UserContext } from "../../context/user-context";
import LoadingSpinner from "../LoadingSpinner";
import Log from "../../logs/Log";
import useToast from "../../hooks/useToast";

const options = [
  { value: "test1", name: "test1" },
  { value: "test2", name: "test2" },
  { value: "test3", name: "test3" },
  { value: "test4", name: "test4" },
  { value: "test5", name: "test5" },
  { value: "test6", name: "test6" },
  { value: "test7", name: "test7" },
  { value: "test8", name: "test8" },
  { value: "test9", name: "test9" },
  { value: "test10", name: "test10" },
];

const TAG = "EmployeeFrom";

const EmployeeFrom = () => {
  const ctx = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const { setConfirmToast, setErrorToast } = useToast();

  const { onChange, formData, resetState } = useForm({
    remarks: {
      value: "",
      validate: true,
    },
    workDone: {
      value: "",
      validate: true,
    },
    date: {
      value: "",
      validate: true,
    },
    endTime: {
      value: "23:59",
      validate: true,
    },
    startTime: {
      value: "08:00",
      validate: true,
    },
    collectedMoney: {
      value: 0,
      validate: true,
    },
  });

  function onSubmitPressHandel() {
    console.log(formData);
    const data = {
      remarks: formData.inputs.remarks.value as string,
      workDone: formData.inputs.workDone.value as string,
      date: formData.inputs.date.value as string,
      endTime: formData.inputs.endTime.value as string,
      startTime: formData.inputs.startTime.value as string,
      collectedMoney: formData.inputs.collectedMoney.value as number,
    };

    setIsLoading(true);

    mw.rdbRequester
      .addUserTempo(ctx.user.localId, data)
      .then(res => {
        setIsLoading(false);
        setConfirmToast("Successful added Tempo");
        resetState();
        Log.info(TAG, "Tempo successful added", res);
      })
      .catch(e => {
        setIsLoading(false);
        setErrorToast("Failed to add tempo");
        resetState();
        Log.error(TAG, "Failed to add tempo", e);
      });
  }

  function inputsText() {
    return (
      <>
        <Input
          onChange={onChange}
          id={"remarks"}
          type={InputEnum.TEXT}
          labelText={"Uwagi"}
          placeholder={"Uwagi"}
          value={formData.inputs.remarks.value as string}
          isValidate={formData.inputs.remarks.validate}
          validators={[validator.containsString]}
        />
        <Input
          id="collectedMoney"
          labelText="Zebrane pieniądze"
          placeholder="Zebrane pieniądze"
          type={InputEnum.NUMBER}
          onChange={onChange}
          isValidate={formData.inputs.collectedMoney.validate}
          value={formData.inputs.collectedMoney.value as string}
          validators={[validator.containsString]}
          currency
        />
      </>
    );
  }

  function selectInput() {
    return (
      <SelectInput
        id="workDone"
        labelText="Wykonana praca"
        placeHolder="Wykonana praca"
        options={options}
        onSelect={onChange}
        defaultValue={{ value: "", name: "" }}
        isValid={formData.inputs.workDone.validate}
      />
    );
  }

  function dateInput() {
    return (
      <DateInput
        id="date"
        labelName="Data"
        value={formData.inputs.date.value as string}
        isValid={formData.inputs.date.validate}
        onChange={onChange}
      />
    );
  }

  function time() {
    return (
      <>
        <NewTimePicker
          id="startTime"
          labelText="Początek"
          placeholder="Początek"
          onChange={onChange}
          isValid={formData.inputs.startTime.validate}
          timeValue={formData.inputs.startTime.value as string}
        />
        <NewTimePicker
          id="endTime"
          labelText="Koniec"
          placeholder="Koniec"
          onChange={onChange}
          timeValue={formData.inputs.endTime.value as string}
          isValid={formData.inputs.endTime.validate}
        />
      </>
    );
  }

  function inputs() {
    return (
      <>
        {dateInput()}
        {time()}
        {inputsText()}
        {selectInput()}
      </>
    );
  }

  function buttons() {
    return (
      <Button
        disabled={!formData.isValid}
        onPress={onSubmitPressHandel}
        buttonText="Wyślij raport"
      />
    );
  }

  return (
    <>
      <From inputs={inputs()} subButtons={buttons()} />
      <LoadingSpinner isLoading={isLoading} />
    </>
  );
};

export default EmployeeFrom;
