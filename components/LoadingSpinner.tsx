import { VFC } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { doNothing } from "../utils/helper";
import Overlay from "./Overlay";

type LoadingSpinnerT = {
  isLoading: boolean;
};

const LoadingSpinner: VFC<LoadingSpinnerT> = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <Overlay onPress={doNothing} style={styles.overlay}>
          <ActivityIndicator
            size="large"
            color={Colors.defaultColors.backGround}
          />
        </Overlay>
      )}
    </>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.defaultColors.blackWithAlpha,
  },
});
