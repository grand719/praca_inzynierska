import ScreenGradient from "../components/ScreenGradient";
import Schedule from "../components/Schedule/Schedule";
import ScheduleForm from "../components/Form/ScheduleForm";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, Platform } from "react-native";
import mw from "../mw/mw";
import { UserDataT } from "./UserDataScreen";
import { userDataMapper } from "../mw/mappers/userMappers";
import Log from "../logs/Log";
import LoadingSpinner from "../components/LoadingSpinner";
import Colors from "../constants/Colors";
import { useToggle } from "../hooks/useToggle";
import Modal from "../components/Modal";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { EnrichedUserScheduleT } from "../mw/mappers/scheduleMapper";
import ScheduleItem from "../components/Schedule/ScheduleItem";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../components/Form/Button";
import { UserContext } from "../context/user-context";
import Overlay from "../components/Overlay";

const TAG = "ScheduleScreen";

function ScheduleScreen() {
  const userCtx = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserDataT[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const { toggle, toggleSwitch } = useToggle(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [userSchedule, setUserSchedule] = useState<EnrichedUserScheduleT[]>([]);
  useEffect(() => {
    setIsLoading(true);
    mw.userRequester
      .getUsers()
      .then(response => {
        const users: UserDataT[] = userDataMapper(response);
        setUsers(users);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        // setErrorToast("Failed to fetch users data or tempo");
        Log.error(TAG, "Could not fetch users", e);
      });
  }, []);

  const updateSchedule = (shouldUpdate: boolean) => {
    setShouldUpdate(shouldUpdate);
  };

  const onDayCellPress = (data: EnrichedUserScheduleT[]) => {
    setUserSchedule(data);
    bottomSheetModalRef.current?.present();
  };

  return (
    <ScreenGradient>
      {userCtx.user.role === "admin" && (
        <Button
          buttonText="Dodaj zmianę"
          disabled={false}
          onPress={() => {
            toggleSwitch();
            bottomSheetModalRef.current?.dismiss();
          }}
        />
      )}
      {toggle && (
        <Modal
          onPress={toggleSwitch}
          style={{ backgroundColor: Colors.defaultColors.blackWithAlpha }}>
          <ScheduleForm
            usersData={users}
            onClose={toggleSwitch}
            updateSchedule={updateSchedule}
          />
        </Modal>
      )}
      <Schedule
        shouldUpdate={shouldUpdate}
        updateSchedule={updateSchedule}
        onPress={onDayCellPress}
      />
      <LoadingSpinner isLoading={isLoading} />
      <BottomSheetModal
        snapPoints={["50%"]}
        name="test"
        backgroundStyle={{ backgroundColor: Colors.defaultColors.backGround }}
        handleIndicatorStyle={{ backgroundColor: Colors.defaultColors.focus }}
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
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {userSchedule.length > 0 ? (
            userSchedule.map((schedule, index) => (
              <ScheduleItem data={schedule} key={index} />
            ))
          ) : (
            <Text style={{ color: Colors.defaultColors.text }}>
              No schedule found
            </Text>
          )}
        </ScrollView>
      </BottomSheetModal>
    </ScreenGradient>
  );
}

export default ScheduleScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});
