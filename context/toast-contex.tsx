/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  useMemo,
  FC,
  ReactNode,
  useReducer,
  Reducer,
} from "react";

export enum messageTypes {
  error,
  confirm,
  notification,
  default,
}
enum reducerActions {
  ADD = "ADD",
  REMOVEBYID = "REMOVEBYID",
}

interface actionT {
  type: reducerActions;
  payload?: messageT | string;
}

export interface messageT {
  id?: string;
  text: string;
  type: messageTypes;
}

type toastContexT = {
  messages: messageT[];
  setMessage: (data: messageT) => void;
  removeMessage: (id: string) => void;
};
type ToastContexProviderT = {
  children: ReactNode;
};

const toastReducer: Reducer<{ messages: messageT[] }, actionT> = (
  state,
  action,
) => {
  switch (action.type) {
    case reducerActions.ADD:
      const dataa = action.payload as messageT;
      state.messages = [
        ...state.messages,
        { id: `${Math.random()}`, text: dataa.text, type: dataa.type },
      ];
      return { ...state };
    case reducerActions.REMOVEBYID:
      const data = state.messages.filter(
        message => message.id !== (action.payload as string),
      );
      state.messages = data;
      return { ...state };
    default:
      return state;
  }
};

const defaultToastContex: toastContexT = {
  messages: [],
  setMessage(data) {},
  removeMessage(id) {},
};

export const ToastContex = createContext<toastContexT>(defaultToastContex);

const ToastContexProvider: FC<ToastContexProviderT> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, {
    messages: defaultToastContex.messages,
  });

  const addMessage = (data: messageT) => {
    dispatch({ type: reducerActions.ADD, payload: data });
  };

  const removeMessage = (id: string) => {
    dispatch({ type: reducerActions.REMOVEBYID, payload: id });
  };

  const value = useMemo<toastContexT>(
    () => ({
      messages: state.messages,
      setMessage: addMessage,
      removeMessage: removeMessage,
    }),
    [state.messages],
  );

  return <ToastContex.Provider value={value}>{children}</ToastContex.Provider>;
};

export default ToastContexProvider;
