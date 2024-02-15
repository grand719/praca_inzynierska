import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import numeral from "numeral";

import ScreenGradient from "../components/ScreenGradient";
import { UserContext } from "../context/user-context";
import Title from "../components/Title";
import Colors from "../constants/Colors";
import Card from "../components/Card";

function MyDetailsScreen() {
  const ctx = useContext(UserContext);

  return (
    <ScreenGradient>
      <Card>
        <Title>{`${ctx.user.name} ${ctx.user.surname}`}</Title>
        <View style={styles.container}>
          <View style={styles.contactWrapper}>
            <View>
              <View style={styles.textWrapper}>
                <Text style={styles.text}>E-mail: {ctx.user.email}</Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.text}>
                  Numer telefonu:{" "}
                  {ctx.user.phoneNumber.match(/.{3}/g)?.join(" ")}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Pensja:{" "}
              {numeral(parseFloat(ctx.user.salary.toString())).format(
                "0,0[.]00 zł",
              )}
            </Text>
          </View>
        </View>
      </Card>
    </ScreenGradient>
  );
}
export default MyDetailsScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  contactWrapper: {
    flexDirection: "column",
    borderBottomWidth: 2,
    borderColor: Colors.defaultColors.focus,
  },
  textWrapper: {
    padding: 5,
  },
  text: {
    fontSize: 25,
    color: Colors.defaultColors.text,
  },
});
