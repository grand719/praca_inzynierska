import { FC, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { UserAdditionalDataT } from "../mw/requesters/UserRequester";
import numeral from "numeral";

import Card from "./Card";
import Button from "./Form/Button";
import ConfirmPopup from "./ConfirmPopup";
import { useToggle } from "../hooks/useToggle";
import mw from "../mw/mw";
import Log from "../logs/Log";
import LoadingSpinner from "./LoadingSpinner";
import useToast from "../hooks/useToast";

const TAG = "UserTile";

type id = {
  id: string;
};

export type UserTileT = {
  userData: UserAdditionalDataT & id;
  userId: string;
};

const UserTile: FC<UserTileT> = ({ userData, userId }) => {
  const { toggle, toggleSwitch } = useToggle(false);
  const { toggle: togglePassword, toggleSwitch: togglePasswordSwitch } =
    useToggle(false);
  const { setConfirmToast, setErrorToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onPasswordReset = () => {
    setIsLoading(true);
    mw.userRequester
      .sendResetPasswordEmail(userData.email)
      .then(data => {
        setIsLoading(false);
        setConfirmToast("Wysłano email do resetu hasła");
        togglePasswordSwitch();
        Log.info(TAG, "Send user reset email", data);
      })
      .catch(e => {
        setIsLoading(false);
        setErrorToast("Błąd wysyłania");
        togglePasswordSwitch();
        Log.error(TAG, "Failed to send user reset email", e);
      });
  };

  const onPressHandler = () => {
    toggleSwitch();
    console.log("test");
  };
  return (
    <>
      <Card>
        <View>
          <Card>
            <Text style={styles.text}>
              Imię: {userData.name} {userData.surname}
            </Text>
          </Card>
          <Card>
            <Text style={styles.text}>
              Numer telefonu: {userData.phoneNumber.match(/.{3}/g)?.join(" ")}
            </Text>
            <Text style={styles.text}>Rola: {userData.role}</Text>
            <Text style={styles.text}>
              Pensja:{" "}
              {numeral(parseFloat(userData.salary.toString())).format(
                "0,0[.]00 $",
              )}
            </Text>
          </Card>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            disabled={false}
            onPress={togglePasswordSwitch}
            buttonText={"Zmień hasło"}
          />
          <Button
            disabled={false}
            onPress={toggleSwitch}
            buttonText={"Usuń użytkownika"}
          />
        </View>
      </Card>
      {toggle && (
        <ConfirmPopup
          title={"Usuń użytkownika: " + userData.name + " " + userData.surname}
          onSubmit={onPressHandler}
          onCancel={toggleSwitch}
        />
      )}
      {togglePassword && (
        <ConfirmPopup
          title={"Zresetuj hasło: " + userData.name + " " + userData.surname}
          onSubmit={onPasswordReset}
          onCancel={togglePasswordSwitch}
        />
      )}
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
    </>
  );
};

export default UserTile;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: Colors.defaultColors.text,
  },
  buttonsContainer: {
    padding: 10,
  },
});
