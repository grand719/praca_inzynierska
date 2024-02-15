import {
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";

type IconButtonType = {
  icon: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

const IconButton: FC<IconButtonType> = ({
  icon,
  size,
  color,
  onPress,
  containerStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.buttonContainer, containerStyle]}>
        <Ionicons name={icon} size={size} color={color} />
      </View>
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
  },
  pressed: {
    opacity: 0.75,
  },
});
