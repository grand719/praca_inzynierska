import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Navigation from "./navigation";
import UserContextProvider from "./context/user-context";
import { PortalProvider, WhitePortal } from "react-native-portal";
import ToastContexProvider from "./context/toast-contex";
import ToastContainer from "./components/toast/Toastcontainer";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NotificationsContextProvider } from "./context/notifacations-context";

export default function App() {
  return (
    <BottomSheetModalProvider>
      <PortalProvider>
        <SafeAreaProvider>
          <StatusBar />
          <UserContextProvider>
            <ToastContexProvider>
              <NotificationsContextProvider>
                <Navigation />
                <WhitePortal name="modal" />
                <WhitePortal name="overlay" />
                <ToastContainer />
              </NotificationsContextProvider>
            </ToastContexProvider>
          </UserContextProvider>
        </SafeAreaProvider>
      </PortalProvider>
    </BottomSheetModalProvider>
  );
}
