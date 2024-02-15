import React, { useCallback, useContext, useEffect, useState } from "react";
import Form from "./Form";
import LoadingSpinner from "../LoadingSpinner";
import Input, { InputEnum } from "./Input";
import CheckInput from "./CheckInput";
import { useForm } from "./Formhooks/form-hook";
import validator from "../../utils/validator";
import Button from "./Button";
import mw from "../../mw/mw";
import { ToastContex, messageTypes } from "../../context/toast-contex";
import Log from "../../logs/Log";

const StuffTypeForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toastCtx = useContext(ToastContex);

  const { onChange, formData, resetState } = useForm({
    stuffTypeName: {
      value: "",
      validate: true,
    },
    isRentable: {
      value: false,
      validate: true,
    },
  });

  const onSubmitPress = useCallback(() => {
    setIsLoading(true);
    mw.rdbRequester
      .addStuff({
        name: formData.inputs.stuffTypeName.value as string,
        rentable: formData.inputs.isRentable.value as boolean,
      })
      .catch(error => {
        Log.error("StuffTypeForm", "Failed to add stuff", error);
        toastCtx.setMessage({
          text: "Błąd podczas dodawania",
          type: messageTypes.error,
        });
      })
      .finally(() => {
        resetState();
        setIsLoading(false);
      });
  }, [formData, resetState, toastCtx]);

  const inputs = () => (
    <>
      <Input
        id={"stuffTypeName"}
        value={formData.inputs.stuffTypeName.value as string}
        type={InputEnum.TEXT}
        labelText={"Nazwa typu"}
        onChange={onChange}
        placeholder="Nazwa typu"
        isValidate={formData.inputs.stuffTypeName.validate}
        validators={[validator.containsString]}
      />
      <CheckInput
        id="isRentable"
        value={formData.inputs.isRentable.value as boolean}
        onChange={onChange}
        labelText="Jest do wypożyczenia"
        isValid={formData.inputs.isRentable.validate}
      />
    </>
  );

  const submitButton = () => (
    <Button
      disabled={!formData.isValid}
      onPress={onSubmitPress}
      buttonText="Dodaj nowy typ"
    />
  );

  return (
    <>
      <Form inputs={inputs()} subButtons={submitButton()} />
      <LoadingSpinner isLoading={isLoading} />
    </>
  );
};

export default StuffTypeForm;
