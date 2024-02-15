import { FC } from "react";
import Card from "./Card";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export type tempoTileT = {
  collectedMoney: number;
  date: string;
  workDone: string;
  remarks: string;
  workTime: string;
  userName: string;
};

const TempoTile: FC<tempoTileT> = ({
  collectedMoney,
  date,
  workDone,
  workTime,
  remarks,
  userName,
}) => {
  return (
    <Card>
      <Text style={styles.title}>Nazwa użytkownika{userName}</Text>
      <View>
        <Text style={styles.text}>Wykonana praca: {workDone} </Text>
        <Text style={styles.text}>Uwagi: {remarks} </Text>
      </View>
      <View>
        <Text style={styles.text}>Wypracowane godziny:{workTime} </Text>
        <Text style={styles.text}>Data: {date} </Text>
      </View>
      <View>
        <Text style={styles.text}>Zebrane przedmioty: {collectedMoney} </Text>
      </View>
    </Card>
  );
};

export default TempoTile;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: Colors.defaultColors.text,
  },
  text: {
    color: Colors.defaultColors.text,
  },
});
