import { View, Text, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import IconButton from "../DatePicker/components/IconButton";
import Colors from "../../constants/Colors";

type CheckInputProps = {
  id: string;
  value: boolean;
  labelText: string;
  onChange: (id: string, data: any) => void;
  mustBeChecked?: boolean;
  isValid: boolean;
};

const CheckInput = ({
  id,
  value,
  labelText,
  onChange,
  mustBeChecked,
  isValid,
}: CheckInputProps) => {
  const onPress = useCallback(() => {
    onChange(id, {
      value: !value,
      validate: mustBeChecked ? value : true,
    });
  }, [id, mustBeChecked, onChange, value]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.labelText}>{labelText}</Text>
      </View>
      <IconButton
        onPress={onPress}
        icon="checkmark-outline"
        size={30}
        containerStyle={[
          styles.checkButton,
          {
            borderColor: isValid
              ? Colors.defaultColors.border
              : Colors.defaultColors.error,
          },
        ]}
        color={
          value
            ? Colors.defaultColors.positive
            : Colors.defaultColors.backGround
        }
      />
    </View>
  );
};

export default CheckInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkButton: {
    backgroundColor: Colors.defaultColors.backGround,
    borderColor: Colors.defaultColors.border,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  labelText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.defaultColors.text,
  },
});
