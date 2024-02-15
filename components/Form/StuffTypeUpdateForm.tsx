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
import { MappedStuffTypesT } from "../../mw/requesters/RDBRequester";

type StuffTypeUpdateFormProps = {
  defaultData?: MappedStuffTypesT;
  onEndEditing: () => void;
};

const StuffTypeUpdateForm = ({
  defaultData,
  onEndEditing,
}: StuffTypeUpdateFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const toastCtx = useContext(ToastContex);

  const { onChange, formData } = useForm({
    isRentable: {
      value: defaultData === undefined ? false : defaultData?.rentable,
      validate: true,
    },
  });

  const onSubmitPress = useCallback(() => {
    if (!defaultData) return;

    if (defaultData.rentable === (formData.inputs.isRentable.value as boolean))
      return;
    setIsLoading(true);
    mw.rdbRequester
      .updateStuffType(
        defaultData?.id,
        defaultData?.name,
        formData.inputs.isRentable.value as boolean,
      )
      .catch(error => {
        Log.error("StuffTypeForm", "Failed to add stuff", error);
        toastCtx.setMessage({
          text: "Failed to add new stuff type",
          type: messageTypes.error,
        });
      })
      .finally(() => {
        setIsLoading(false);
        onEndEditing();
      });
  }, [defaultData, formData, toastCtx, onEndEditing]);

  const inputs = () => (
    <>
      <CheckInput
        id="isRentable"
        value={formData.inputs.isRentable.value as boolean}
        onChange={onChange}
        labelText="Is rentable"
        isValid={formData.inputs.isRentable.validate}
      />
    </>
  );

  const submitButton = () => (
    <Button
      disabled={!formData.isValid}
      onPress={onSubmitPress}
      buttonText="Edit stuff type"
    />
  );

  return (
    <>
      <Form inputs={inputs()} subButtons={submitButton()} />
      <LoadingSpinner isLoading={isLoading} />
    </>
  );
};

export default StuffTypeUpdateForm;
