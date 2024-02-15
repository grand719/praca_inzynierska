import { useContext } from "react";
import { ToastContex, messageTypes } from "../context/toast-contex";

type useToastT = {
  setConfirmToast: (message: string) => void;
  setErrorToast: (message: string) => void;
};

const useToast = (): useToastT => {
  const ctx = useContext(ToastContex);

  function setConfirmToast(message: string) {
    ctx.setMessage({ text: message, type: messageTypes.confirm });
  }

  function setErrorToast(message: string) {
    ctx.setMessage({ text: message, type: messageTypes.error });
  }

  return { setConfirmToast: setConfirmToast, setErrorToast: setErrorToast };
};

export default useToast;
