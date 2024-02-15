import { VFC } from "react";
import { StyleSheet, View } from "react-native";

import DatePicker from "../../DatePicker/components/DatePicker";
import Overlay from "../../Overlay";

import Colors from "../../../constants/Colors";

type DatePickerOverlayProps = {
  isVisible: boolean;
  onClose: () => void;
  onPress: (value: Date) => void;
  value?: Date;
  disableWeekends?: boolean;
};

const DatePickerWithOverlay: VFC<DatePickerOverlayProps> = ({
  onClose,
  onPress,
  isVisible,
  value,
  disableWeekends,
}) => {
  return (
    <>
      {isVisible && (
        <Overlay onPress={onClose} style={styles.overlay}>
          <View style={styles.datePickerWrapper}>
            <DatePicker onPress={onPress} value={value} />
          </View>
        </Overlay>
      )}
    </>
  );
};

export default DatePickerWithOverlay;

const styles = StyleSheet.create({
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.defaultColors.black,
    opacity: 0.75,
  },
  datePickerWrapper: {
    borderRadius: 10,
    backgroundColor: Colors.defaultColors.backGround,
  },
});
