import { useContext } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { ToastContex } from "../../context/toast-contex";
import Toast from "./Toast";

const ToastContainer = () => {
  const toastContex = useContext(ToastContex);
  return (
    <View style={styles.wrapper}>
      {toastContex.messages && (
        <FlatList
          contentContainerStyle={styles.container}
          data={toastContex.messages}
          renderItem={data => {
            return <Toast data={data.item} />;
          }}
        />
      )}
    </View>
  );
};

export default ToastContainer;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "absolute",
    padding: 10,
    top: 25,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
