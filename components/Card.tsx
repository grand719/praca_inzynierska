import { ReactNode, FC } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import Colors from "../constants/Colors";

type CardT = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const Card: FC<CardT> = ({ children, style, onLayout }) => {
  return (
    <View onLayout={onLayout} style={[styles.card, style]}>
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderRadius: 20,
    borderColor: Colors.defaultColors.focus,
    backgroundColor: Colors.defaultColors.backGround,
    padding: 10,
    margin: 10,
  },
});
