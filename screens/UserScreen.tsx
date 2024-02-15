/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ScreenGradient from "../components/ScreenGradient";
import Button from "../components/Form/Button";
import { getRouteHeaders, UserOptionsRouteMap } from "../constants/Route";
import { UserContext } from "../context/user-context";

//@ts-ignore
function UserScreen({ navigation }) {
  const ctx = useContext(UserContext);
  const options = Object.keys(UserOptionsRouteMap);

  function logout() {
    ctx.logoutUser();
  }

  function generateOptions() {
    return options.map((option, id) => {
      return (
        <View key={`${option}-${id}`} style={styles.buttonContainer}>
          <Button
            disabled={false}
            onPress={() =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
              navigation.navigate(
                UserOptionsRouteMap[option as keyof typeof UserOptionsRouteMap],
              )
            }
            buttonText={getRouteHeaders(
              UserOptionsRouteMap[option as keyof typeof UserOptionsRouteMap],
            )}
          />
        </View>
      );
    });
  }

  return (
    <ScreenGradient>
      <View style={styles.optionsContainer}>{generateOptions()}</View>
      <View style={styles.logoutContainer}>
        <Button disabled={false} onPress={logout} buttonText="Wyloguj" />
      </View>
    </ScreenGradient>
  );
}

export default UserScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
  },
  optionsContainer: {
    paddingHorizontal: 10,
    flexDirection: "column",
    flexGrow: 1,
  },
  logoutContainer: {
    padding: 10,
    marginBottom: 20,
  },
});
