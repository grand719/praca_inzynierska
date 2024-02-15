import { VFC } from "react";
import { View, StyleSheet } from "react-native";

import Button from "../Button";

export type OptionProps = {
  name: string;
  value: string;
  onSelect: (value: string) => void;
};

const Option: VFC<OptionProps> = ({ value, onSelect, name }) => {
  function onPressHandler() {
    onSelect(value);
  }

  return (
    <View style={styles.optionContainer}>
      <Button disabled={false} onPress={onPressHandler} buttonText={name} />
    </View>
  );
};

export default Option;

const styles = StyleSheet.create({
  optionContainer: {
    marginVertical: 4,
  },
});
