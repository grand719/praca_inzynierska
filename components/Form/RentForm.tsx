import React, { useCallback, useContext, useMemo } from "react";
import From from "./Form";
import { useForm } from "./Formhooks/form-hook";
import Card from "../Card";
import Title, { titleSize } from "../Title";
import {
  MappedStuffItemT,
  StuffReservationT,
} from "../../mw/requesters/RDBRequester";
import StuffItemRentalList from "../StuffItemRentalList";
import Input, { InputEnum } from "./Input";
import DateInput from "./DateInput/DateInput";
import { ScrollView } from "react-native-gesture-handler";
import { isSameDay, isTimeAvailableLoop } from "../../utils/helper";
import Button from "./Button";
import NewTimePicker from "./NewTimePicker";
import mw from "../../mw/mw";
import Log from "../../logs/Log";
import { ToastContex, messageTypes } from "../../context/toast-contex";
import { useSaveReservations } from "../../hooks/useSaveReservations";

function generateUserCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

type RentFormProps = {
  targetItemData?: MappedStuffItemT;
  refresh: (stuffName: string, forceFetch?: boolean) => void;
  closeModal: () => void;
};

const RentForm = ({ targetItemData, refresh, closeModal }: RentFormProps) => {
  const currentDate = Date.now();
  const { formData, onChange, resetState } = useForm({
    rentDay: { value: "", validate: true },
    startRent: { value: "", validate: true },
    endRent: { value: "", validate: true },
    clientEmail: { value: "", validate: true },
  });
  const { saveReservationNumber } = useSaveReservations();

  const toastCtx = useContext(ToastContex);

  const currentSelectedDayRental = useMemo(() => {
    if (!targetItemData) return [];
    if (!targetItemData.stuffRental) return [];
    return targetItemData.stuffRental.filter(
      data => isSameDay(data.startRent, currentDate) && !data.isCanceled,
    );
  }, [currentDate, targetItemData]);

  const onSubmitPress = useCallback(() => {
    if (!targetItemData) return;
    const startDate = new Date(formData.inputs.rentDay.value as string);
    startDate.setHours(
      parseInt((formData.inputs.startRent.value as string).split(":")[0]),
    );
    const endDate = new Date(formData.inputs.rentDay.value as string);
    endDate.setHours(
      parseInt((formData.inputs.endRent.value as string).split(":")[0]),
    );

    const reservationObject: StuffReservationT = {
      startRent: startDate.getTime(),
      endRent: endDate.getTime(),
      clientEmail: formData.inputs.clientEmail.value as string,
      isCanceled: false,
      isDone: false,
      reservationShortId: generateUserCode(8),
      stuffItem: {
        stuffType: targetItemData.stuffType.name,
        itemId: targetItemData.id,
      },
    };

    if (
      !isTimeAvailableLoop(targetItemData.stuffRental, {
        start: reservationObject.startRent,
        end: reservationObject.endRent,
      })
    ) {
      toastCtx.setMessage({
        type: messageTypes.error,
        text: "Przedmiot jest już wypożyczony w tym przedziale czasowym",
      });
      Log.error("RentForm", "Could not rent in such time");
      return;
    }

    mw.rdbRequester
      .createReservation(
        reservationObject.reservationShortId,
        reservationObject,
      )
      .then(code => {
        return mw.rdbRequester.stuffItemRent(
          {
            startRent: reservationObject.startRent,
            endRent: reservationObject.endRent,
            isCanceled: false,
            isDone: false,
            clientEmail: reservationObject.clientEmail,
            reservationId: code.name,
          },
          targetItemData,
        );
      })
      .catch(e => {
        toastCtx.setMessage({
          type: messageTypes.error,
          text: "Błąd wypożyczania: " + targetItemData.name,
        });
        Log.error("RentForm", "Failed to rent", e);
      })
      .finally(() => {
        saveReservationNumber({
          stuffItem: reservationObject.stuffItem,
          reservationShortId: reservationObject.reservationShortId,
        }).catch(e => {
          console.log(e);
        });
        refresh(targetItemData.stuffType.name, true);
        closeModal();
        resetState();
      });
  }, [
    formData,
    targetItemData,
    refresh,
    closeModal,
    resetState,
    toastCtx,
    saveReservationNumber,
  ]);

  const inputs = (
    <>
      <Input
        id={"clientEmail"}
        type={InputEnum.EMAIL}
        labelText={"E-mail"}
        onChange={onChange}
        placeholder={"E-mail"}
        isValidate={formData.inputs.clientEmail.validate}
        value={formData.inputs.clientEmail.value as string}
        validators={[]}
      />
      <DateInput
        value={formData.inputs.rentDay.value as string}
        isValid={formData.inputs.rentDay.validate}
        labelName={"Wybierz datę"}
        id={"rentDay"}
        onChange={onChange}
      />
      <NewTimePicker
        id={"startRent"}
        labelText={"Początkowa godzina"}
        placeholder={"12:00"}
        onChange={onChange}
        isValid={formData.inputs.startRent.validate}
        timeValue={formData.inputs.startRent.value as string}
      />
      <NewTimePicker
        id={"endRent"}
        labelText={"Godzina końcowa"}
        placeholder={"15:00"}
        onChange={onChange}
        isValid={formData.inputs.endRent.validate}
        timeValue={formData.inputs.endRent.value as string}
      />
    </>
  );

  const submitButton = (
    <Button
      buttonText="Wypożycz"
      onPress={onSubmitPress}
      disabled={!formData.isValid}
    />
  );

  return (
    <Card style={{ maxHeight: "70%" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title size={titleSize.medium}>{targetItemData?.name}</Title>
        <From inputs={inputs} subButtons={submitButton} />
        <Title size={titleSize.medium}>Rental:</Title>
        <StuffItemRentalList data={currentSelectedDayRental} />
      </ScrollView>
    </Card>
  );
};

export default RentForm;
