/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ScrollView, Text, View } from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSaveReservations } from "../hooks/useSaveReservations";
import Button from "../components/Form/Button";
import Card from "../components/Card";
import Title, { titleSize } from "../components/Title";
import mw from "../mw/mw";
import Log from "../logs/Log";
import Colors from "../constants/Colors";
import { useToggle } from "../hooks/useToggle";
import ConfirmPopup from "./ConfirmPopup";
import { UserContext } from "../context/user-context";
import Input, { InputEnum } from "./Form/Input";
import { selectedStuffReservationMapper } from "../mw/mappers/stuffMapper";
import { ToastContex, messageTypes } from "../context/toast-contex";
import DateInput from "./Form/DateInput/DateInput";
import { actionDataType } from "./Form/Formhooks/form-hook";

const TAG = "ReservationScreenContent";

type ReservationScreenContentProps = {
  resetScreenContent: () => void;
};

const ReservationScreenContent = ({
  resetScreenContent,
}: ReservationScreenContentProps) => {
  const currentDate = new Date();
  const [selectedReservation, setSelectedReservation] = useState("");
  const [date, setDate] = useState(currentDate.toDateString());
  const { toggle, toggleSwitch } = useToggle(false);
  const { toggle: toggleDone, toggleSwitch: toggleDoneSwitch } =
    useToggle(false);
  const userCtx = useContext(UserContext);
  const toastCtx = useContext(ToastContex);
  const {
    saveReservationNumber,
    savedReservation,
    reservations,
    fetchedStuffItems,
    fetchAdditionalReservationData,
    getSavedData,
    fetchByDate,
  } = useSaveReservations();

  useEffect(() => {
    if (!userCtx.user.loggedIn) {
      getSavedData().catch(e => {
        console.log(e);
      });
    } else {
      fetchByDate(currentDate.toDateString()).catch(e => {
        console.log(e);
      });
    }
  }, []);

  const selectedReservationDetails = useMemo(
    () =>
      reservations.find(
        data => data.reservationShortId === selectedReservation,
      ),
    [reservations, selectedReservation],
  );

  const selectedStuffItem = useMemo(
    () =>
      fetchedStuffItems.find(
        data => data.id === selectedReservationDetails?.stuffItem.itemId,
      ),
    [fetchedStuffItems, selectedReservationDetails],
  );

  const onButtonPressHandler = useCallback(
    (id: string) => {
      if (selectedReservation === id) {
        setSelectedReservation("");
        return;
      }
      setSelectedReservation(id);
      fetchAdditionalReservationData(id);
    },
    [fetchAdditionalReservationData, selectedReservation],
  );

  const onCancelButtonHandler = useCallback(() => {
    if (
      selectedReservationDetails === undefined ||
      selectedStuffItem === undefined
    ) {
      return;
    }

    mw.rdbRequester
      .updateReservationStatus(
        selectedReservationDetails.reservationShortId,
        selectedReservationDetails.id,
        selectedStuffItem,
        true,
      )
      .catch(e => {
        Log.error(TAG, "Failed to cancel reservation: ", e);
      })
      .finally(() => {
        onButtonPressHandler(selectedReservation);
        resetScreenContent();
      });
  }, [
    onButtonPressHandler,
    selectedReservation,
    selectedReservationDetails,
    selectedStuffItem,
    resetScreenContent,
  ]);

  const onDoneButtonHandler = useCallback(() => {
    if (
      selectedReservationDetails === undefined ||
      selectedStuffItem === undefined
    ) {
      return;
    }

    mw.rdbRequester
      .updateReservationStatus(
        selectedReservationDetails.reservationShortId,
        selectedReservationDetails.id,
        selectedStuffItem,
        false,
      )
      .catch(e => {
        Log.error(TAG, "Failed to reservation: ", e);
      })
      .finally(() => {
        onButtonPressHandler(selectedReservation);
        resetScreenContent();
      });
  }, [
    onButtonPressHandler,
    selectedReservation,
    selectedReservationDetails,
    selectedStuffItem,
    resetScreenContent,
  ]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNewData = useCallback(
    (code: string) => {
      mw.rdbRequester
        .getReservationByCode(code)
        .then(data => {
          if (Object.keys(data).length === 0) {
            toastCtx.setMessage({
              text: "Nie znaleziono takiej rezerwacji",
              type: messageTypes.error,
            });
            Log.error(TAG, "No reservations found: ", data);
            return;
          }
          Log.info(TAG, "Reservation found: ", data);
          const mappedData = selectedStuffReservationMapper(data);
          saveReservationNumber({
            reservationShortId: mappedData[0].reservationShortId,
            stuffItem: {
              stuffType: mappedData[0].stuffItem.stuffType,
              itemId: mappedData[0].stuffItem.itemId,
            },
          })
            .then(() => {
              resetScreenContent();
            })
            .catch(error => {
              Log.error(TAG, "Failed to save new added reservation", error);
            });
        })
        .catch(error => {
          Log.error(TAG, "Failed to get reservation by code", error);
        });
    },
    [resetScreenContent, saveReservationNumber, toastCtx],
  );

  const onChangeHandler = useCallback(
    (id: string, data: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if ((data.value as string).length === 0) return;
      const timeOut = setTimeout(
        fetchNewData.bind(null, data.value as string),
        1000,
      );
      timeoutRef.current = timeOut;
    },
    [fetchNewData],
  );

  const onDateChangeHandler = useCallback(
    (id: string, data: actionDataType) => {
      fetchByDate(data.value as string)
        .catch(error => Log.error(TAG, "Failed to fetch by date", error))
        .finally(() => setDate(data.value as string));
    },
    [fetchByDate],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <Button
        buttonText="Odśwież"
        disabled={false}
        onPress={resetScreenContent}
      />
      {!userCtx.user.localId ? (
        <Input
          id={"Find reservation by ID"}
          type={InputEnum.TEXT}
          labelText={"Znajdź po numerze rezerwacji"}
          onChange={onChangeHandler}
          placeholder={"Znajdź po numerze rezerwacji"}
          isValidate={true}
          validators={[]}
        />
      ) : (
        <DateInput
          value={date}
          isValid={true}
          labelName={""}
          id={"Fetch by date"}
          onChange={onDateChangeHandler}
        />
      )}

      <ScrollView>
        {savedReservation.map(data => (
          <View key={data.reservationShortId}>
            <Button
              buttonText={`${data.stuffItem.stuffType} ID: ${data.reservationShortId}`}
              onPress={onButtonPressHandler.bind(null, data.reservationShortId)}
              shouldBeRounded={false}
              disabled={false}
            />
            {selectedReservationDetails &&
              selectedReservation === data.reservationShortId &&
              selectedStuffItem && (
                <Card>
                  <Title size={titleSize.small}>{`${selectedStuffItem.name} ${
                    selectedReservationDetails.isCanceled
                      ? "| Anulowana"
                      : selectedReservationDetails.isDone
                      ? "| Ukończona"
                      : ""
                  }`}</Title>
                  <Text
                    style={{
                      color: Colors.defaultColors.text,
                      marginLeft: 15,
                    }}>{`ID: ${selectedReservationDetails.reservationShortId}`}</Text>
                  <Text
                    style={{
                      color: Colors.defaultColors.text,
                      marginLeft: 15,
                    }}>
                    {"Data rezerwacji: " +
                      new Date(
                        selectedReservationDetails.startRent,
                      ).toDateString()}
                  </Text>
                  <Text
                    style={{
                      color: Colors.defaultColors.text,
                      marginLeft: 15,
                    }}>
                    {`Od: ${new Date(
                      selectedReservationDetails.startRent,
                    ).getHours()} Do: ${new Date(
                      selectedReservationDetails.endRent,
                    ).getHours()}`}
                  </Text>
                  <Button
                    buttonText="Anuluj rezerwacje"
                    onPress={toggleSwitch}
                    disabled={
                      selectedReservationDetails.isCanceled ||
                      selectedReservationDetails.isDone
                    }
                  />
                  {userCtx.user.loggedIn && (
                    <Button
                      buttonText="Oznacz jako zakończona"
                      onPress={toggleDoneSwitch}
                      disabled={
                        selectedReservationDetails.isCanceled ||
                        selectedReservationDetails.isDone
                      }
                    />
                  )}
                </Card>
              )}
          </View>
        ))}
      </ScrollView>
      {toggle && (
        <ConfirmPopup
          title={`Anuluje rezerwacje: ${
            selectedReservationDetails?.reservationShortId || ""
          }`}
          onSubmit={onCancelButtonHandler}
          onCancel={toggleSwitch}
        />
      )}
      {toggleDone && (
        <ConfirmPopup
          title={`Oznacz jako zakończona: ${
            selectedReservationDetails?.reservationShortId || ""
          }`}
          onSubmit={onDoneButtonHandler}
          onCancel={toggleDoneSwitch}
        />
      )}
    </>
  );
};

export default ReservationScreenContent;
