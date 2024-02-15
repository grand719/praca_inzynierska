import { VFC } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";

type FormButtonType = {
  disabled: boolean;
  onPress: () => void;
  buttonText: string;
  shouldBeRounded?: boolean;
};

const Button: VFC<FormButtonType> = ({
  disabled,
  onPress,
  buttonText,
  shouldBeRounded = true,
}) => {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={{ width: "100%" }}>
      {({ pressed }) => (
        <View
          style={[
            shouldBeRounded
              ? styles.buttonWrapperRounded
              : styles.buttonWrapper,
            pressed && styles.buttonPressed,
            disabled && styles.disabled,
          ]}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonWrapperRounded: {
    height: 50,
    width: "100%",
    backgroundColor: Colors.defaultColors.backGround,
    borderRadius: 40,
    borderWidth: 3,
    padding: 5,
    borderColor: Colors.defaultColors.border,
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
  },
  buttonWrapper: {
    height: 50,
    width: "100%",
    backgroundColor: Colors.defaultColors.backGround,
    borderColor: Colors.defaultColors.border,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.defaultColors.text,
  },
  buttonPressed: {
    backgroundColor: Colors.defaultColors.focus,
    borderColor: Colors.defaultColors.focus,
  },
  disabled: {
    opacity: 0.6,
  },
});
