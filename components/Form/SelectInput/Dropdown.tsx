import React, { useCallback, useImperativeHandle, useRef } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";

import Option, { OptionProps } from "./Option";
import Colors from "../../../constants/Colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Button from "../Button";

type options = Omit<OptionProps, "style" | "textStyle" | "onSelect">;

export type DropDownProps = {
  options: options[];
  onSelect: (value: string) => void;
};

export type DropDownRefProps = {
  openModal: () => void;
  closeModal: () => void;
};

const DropDown = React.forwardRef<DropDownRefProps, DropDownProps>(
  ({ options, onSelect }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const openModal = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);

    const closeModal = useCallback(() => {
      bottomSheetModalRef.current?.dismiss();
    }, []);

    useImperativeHandle(ref, () => ({ openModal, closeModal }), [
      closeModal,
      openModal,
    ]);

    return (
      <BottomSheetModal
        snapPoints={["80%"]}
        name="test"
        backgroundStyle={{ backgroundColor: Colors.defaultColors.backGround }}
        handleIndicatorStyle={{ backgroundColor: Colors.defaultColors.focus }}
        handleHeight={15}
        handleStyle={{
          backgroundColor: Colors.defaultColors.backGround,
          borderRadius: 15,
          opacity: Platform.OS === "android" ? 0 : 1,
        }}
        ref={bottomSheetModalRef}>
        {Platform.OS === "android" && (
          <Button
            buttonText="Zamknij"
            disabled={false}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
            }}
          />
        )}
        <ScrollView style={styles.scrollView}>
          {options.map((props, index) => {
            return <Option onSelect={onSelect} {...props} key={index} />;
          })}
        </ScrollView>
      </BottomSheetModal>
    );
  },
);

export default DropDown;

const styles = StyleSheet.create({
  dropDownContainer: {
    backgroundColor: Colors.defaultColors.backGround,
    borderColor: Colors.defaultColors.focus,
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    width: "70%",
    minHeight: 400,
    maxHeight: 450,
    marginBottom: 200,
  },
  overlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.defaultColors.blackWithAlpha,
  },
  scrollView: {
    flex: 1,
  },
});
