import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import From from "./Form";
import LoadingSpinner from "../LoadingSpinner";
import Input, { InputEnum } from "./Input";
import SelectInput, { SelectInputRefProps } from "./SelectInput/SelectInput";
import { useForm } from "./Formhooks/form-hook";
import validator from "../../utils/validator";
import {
  MappedStuffTypesT,
  StuffItemT,
} from "../../mw/requesters/RDBRequester";
import mw from "../../mw/mw";
import { stuffMapper } from "../../mw/mappers/stuffMapper";
import { ToastContex, messageTypes } from "../../context/toast-contex";
import Log from "../../logs/Log";
import Button from "./Button";

const StuffItemForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stuffTypes, setStuffTypes] = useState<MappedStuffTypesT[]>([]);
  const stuffOptions = useMemo(
    () =>
      stuffTypes.map(stuffType => ({
        name: stuffType.name,
        value: stuffType.id,
      })),
    [stuffTypes],
  );

  const selectInputRef = useRef<SelectInputRefProps>(null);

  const toastCtx = useContext(ToastContex);

  const { onChange, formData, resetState } = useForm({
    stuffItemName: {
      value: "",
      validate: true,
    },
    stuffItemType: {
      value: "",
      validate: true,
    },
    stuffItemDescription: {
      value: "",
      validate: true,
    },
    stuffItemPrice: {
      value: 0,
      validate: true,
    },
  });

  useEffect(() => {
    setIsLoading(true);
    mw.rdbRequester
      .getStuff()
      .then(data => {
        const mappedData = stuffMapper(data);

        setStuffTypes(mappedData);
      })
      .catch(error => {
        Log.error("StuffItemForm", "Failed to get stuff types error:", error);
        toastCtx.setMessage({
          text: "Błąd pobierania typów przedmiotu",
          type: messageTypes.error,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onSubmit = useCallback(() => {
    const stuffType = stuffTypes.find(
      data => data.id === formData.inputs.stuffItemType.value,
    );

    if (!stuffType) {
      toastCtx.setMessage({
        text: "Błąd w znalezieniu typu",
        type: messageTypes.error,
      });
      return;
    }
    const stuffItemData: StuffItemT = {
      stuffType: stuffType,
      name: formData.inputs.stuffItemName.value as string,
      description: formData.inputs.stuffItemDescription.value as string,
      stuffRental: [],
      price: formData.inputs.stuffItemPrice.value as number,
    };
    setIsLoading(true);

    mw.rdbRequester
      .addStuffItem(stuffItemData)
      .catch(error => {
        toastCtx.setMessage({
          text: "Błąd podczas dodawania nowego przedmiotu",
          type: messageTypes.error,
        });
        Log.error("StuffItemForm", "Failed to add stuff item", error);
      })
      .finally(() => {
        setIsLoading(false);
        resetState();
        selectInputRef.current?.resetValue();
      });
  }, [formData, resetState, stuffTypes, toastCtx]);

  const inputs = () => (
    <>
      <Input
        id={"stuffItemName"}
        type={InputEnum.TEXT}
        labelText={"Nazwa przedmiotu"}
        onChange={onChange}
        placeholder={"Nazwa przedmiotu"}
        isValidate={formData.inputs.stuffItemName.validate}
        value={formData.inputs.stuffItemName.value as string}
        validators={[validator.containsString]}
      />
      <SelectInput
        id={"stuffItemType"}
        options={stuffOptions}
        labelText={"Typ przedmiotu"}
        placeHolder={"Typ przedmiotu"}
        onSelect={onChange}
        ref={selectInputRef}
        defaultValue={{ value: "", name: "" }}
        shouldDisplayNameAsValue
        isValid={formData.inputs.stuffItemType.validate}
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
        value={formData.inputs.stuffItemPrice.value as string}
        validators={[validator.containsString]}
      />
    </>
  );

  const submitButton = () => (
    <Button
      onPress={onSubmit}
      buttonText="Dodaj nowy przedmiot"
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

export default StuffItemForm;
