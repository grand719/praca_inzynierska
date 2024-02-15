import { VFC } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";
import Card from "./Card";
import Button from "./Form/Button";
import Overlay from "./Overlay";
import Title from "./Title";

type ConfirmPopupT = {
  title: string;
  onSubmit: () => void;
  onCancel: () => void;
};

const ConfirmPopup: VFC<ConfirmPopupT> = ({ title, onSubmit, onCancel }) => {
  return (
    <Overlay onPress={onCancel} style={styles.overlay}>
      <Card>
        <Title>{title}</Title>
        <View>
          <Button
            onPress={onSubmit}
            disabled={false}
            buttonText={"Zaakceptuj"}
          />
          <Button onPress={onCancel} disabled={false} buttonText={"Anuluj"} />
        </View>
      </Card>
    </Overlay>
  );
};

export default ConfirmPopup;

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: Colors.defaultColors.blackWithAlpha,
    justifyContent: "center",
    alignItems: "center",
  },
});
