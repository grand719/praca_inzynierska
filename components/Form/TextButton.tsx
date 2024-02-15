import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

type TextButtonProps = {
  onPress: () => void;
  text: string;
  textSize?: number;
};

const TextButton = ({ onPress, text, textSize = 20 }: TextButtonProps) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.text, { fontSize: textSize }]}>{text}</Text>
    </Pressable>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  text: {
    color: Colors.defaultColors.text,
  },
});
