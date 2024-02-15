/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useContext, useState } from "react";
import From from "./Form";
import LoadingSpinner from "../LoadingSpinner";
import Input, { InputEnum } from "./Input";
import { useForm } from "./Formhooks/form-hook";
import validator from "../../utils/validator";
import { MappedStuffItemT, StuffItemT } from "../../mw/requesters/RDBRequester";
import { ToastContex, messageTypes } from "../../context/toast-contex";
import Log from "../../logs/Log";
import Button from "./Button";
import mw from "../../mw/mw";

type StuffItemFormProps = {
  defaultData?: MappedStuffItemT;
  closeModal: () => void;
  onEditEnd: () => void;
};

const StuffItemUpdateForm = ({
  defaultData,
  closeModal,
  onEditEnd,
}: StuffItemFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const toastCtx = useContext(ToastContex);

  const { onChange, formData } = useForm({
    stuffItemName: {
      value: defaultData?.name || "",
      validate: true,
    },
    stuffItemDescription: {
      value: defaultData?.description || "",
      validate: true,
    },
    stuffItemPrice: {
      value: defaultData?.price || 0,
      validate: true,
    },
  });

  const onSubmit = useCallback(() => {
    const stuffItemData: Partial<StuffItemT> = {
      name: formData.inputs.stuffItemName.value as string,
      description: formData.inputs.stuffItemDescription.value as string,
      price: formData.inputs.stuffItemPrice.value as number,
    };

    const stuffObject: Partial<StuffItemT> = {};

    if (!defaultData) {
      toastCtx.setMessage({
        text: "Nie znaleziono przedmiotu",
        type: messageTypes.error,
      });
      return;
    }

    for (const key in stuffItemData) {
      if (
        stuffItemData[key as keyof typeof stuffItemData] &&
        stuffItemData[key as keyof typeof stuffItemData] !==
          defaultData[key as keyof typeof stuffItemData]
      ) {
        //@ts-ignore
        stuffObject[key] = stuffItemData[key as keyof typeof stuffItemData];
      }
    }

    if (Object.keys(stuffObject).length === 0) {
      toastCtx.setMessage({
        text: "żadne zmiany nie zostały wprowadzone.",
        type: messageTypes.error,
      });
      return;
    }
    setIsLoading(true);

    mw.rdbRequester
      .updateStuffItems(defaultData, stuffObject)
      .then(() => {
        toastCtx.setMessage({
          text: "Pomyślna edycja.",
          type: messageTypes.confirm,
        });
        closeModal();
      })
      .catch(error => {
        toastCtx.setMessage({
          text: "Błąd podczas edycji",
          type: messageTypes.error,
        });
        Log.error("StuffItemForm", "Failed to modify stuff item", error);
      })
      .finally(() => {
        setIsLoading(false);
        onEditEnd();
      });
  }, [formData, defaultData, toastCtx, closeModal, onEditEnd]);

  const inputs = () => (
    <>
      <Input
        id={"stuffItemName"}
        type={InputEnum.TEXT}
        labelText={"Nazwa"}
        onChange={onChange}
        placeholder={"Nazwa"}
        isValidate={formData.inputs.stuffItemName.validate}
        value={formData.inputs.stuffItemName.value as string}
        validators={[validator.containsString]}
      />
      <Input
        id={"stuffItemDescription"}
        type={InputEnum.TEXT}
        labelText={"Opis"}
        onChange={onChange}
        placeholder={"Opis"}
        isValidate={formData.inputs.stuffItemDescription.validate}
        value={formData.inputs.stuffItemDescription.value as string}
        validators={[validator.containsString]}
      />
      <Input
        id={"stuffItemPrice"}
        type={InputEnum.NUMBER}
        labelText={"Cena za 1h"}
        onChange={onChange}
        placeholder={"Cena za 1h"}
        isValidate={formData.inputs.stuffItemPrice.validate}
        value={formData.inputs.stuffItemPrice.value.toString()}
        validators={[validator.containsString]}
      />
    </>
  );

  const submitButton = () => (
    <Button
      onPress={onSubmit}
      buttonText="Edytuj"
      disabled={!formData.isValid}
    />
  );

  return (
    <>
      <From inputs={inputs()} subButtons={submitButton()} />
      <LoadingSpinner isLoading={isLoading} />
    </>
  );
};

export default StuffItemUpdateForm;
