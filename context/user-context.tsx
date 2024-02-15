/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  useMemo,
  useState,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { UserT, UserAdditionalDataT } from "../mw/requesters/UserRequester";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { storageNames } from "../mw/AsyncStorage";
import LoadingSpinner from "../components/LoadingSpinner";
import Log from "../logs/Log";
import mw from "../mw/mw";

const TAG = "UserContex";

export type userDataType = {
  loggedIn: boolean;
  loggedTimeStamp?: number;
} & UserT &
  UserAdditionalDataT;

const defaultContextState: userDataType = {
  email: "",
  phoneNumber: "",
  salary: 0,
  name: "",
  surname: "",
  idToken: "",
  refreshToken: "",
  expiresIn: "",
  localId: "",
  registered: false,
  role: "",
  loggedTimeStamp: 0,
  loggedIn: false,
};

export type UserContextType = {
  user: userDataType;
  setUser: (userData: userDataType) => void;
  logoutUser: () => void;
};

type UserContextProviderType = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextType>({
  user: defaultContextState,
  setUser: (userData: userDataType) => {},
  logoutUser() {},
});

const UserContextProvider: FC<UserContextProviderType> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] =
    useState<userDataType>(defaultContextState);
  const userContextRef = useRef<userDataType>(defaultContextState);
  const { setItem, removeItem, getItem } = useAsyncStorage(storageNames.USER);
  const init = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const clearTimeoutRef = (id: NodeJS.Timeout) => {
    clearTimeout(id);
    timeoutRef.current = undefined;
  };

  const setTimeoutRef = (
    functionToPass: () => void,
    numberOfTimeout: number,
  ) => {
    Log.info(TAG, "Start refresh counter", numberOfTimeout);
    if (timeoutRef.current) {
      clearTimeoutRef(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(functionToPass, numberOfTimeout);
  };

  function setUser(userData: userDataType) {
    const loggedTimeStamp = Date.now();
    const user = { ...userData, loggedTimeStamp };
    setItem(JSON.stringify(user))
      .then(_ => {})
      .catch(e => {
        Log.error(TAG, "Failed to save user", e);
      });
    setUserContext(user);
    userContextRef.current = user;

    const timePassedInSeconds = (Date.now() - loggedTimeStamp) / 1000;
    setTimeoutRef(
      refreshUserToken,
      (parseInt(userData.expiresIn) - timePassedInSeconds) * 1000,
    );
  }

  function logoutUser() {
    removeItem()
      .then(_ => {})
      .catch(_ => {});
    if (timeoutRef.current) clearTimeoutRef(timeoutRef.current);
    setUserContext(defaultContextState);
  }

  const refreshUserToken = () => {
    Log.info(TAG, "Start to refresh token");
    mw.userRequester
      .userRefreshToken(userContextRef.current.refreshToken)
      .then(userData => {
        const loggedTimeStamp = Date.now();
        setUser({
          ...userContextRef.current,
          loggedTimeStamp,
          refreshToken: userData.refresh_token,
          expiresIn: userData.expires_in,
          idToken: userData.id_token,
          loggedIn: true,
        });
        mw.fireBaseRequester.setParams({
          idToken: userData.id_token,
          role: userContextRef.current.role,
        });
        Log.info(
          TAG,
          "Token refreshed",
          loggedTimeStamp,
          userData,
          userContextRef.current,
        );
      })
      .catch(error => {
        Log.error(
          TAG,
          "Failed to refresh user token. Proceed to sign out user",
          error,
        );
        if (timeoutRef.current) clearTimeoutRef(timeoutRef.current);
        logoutUser();
      });
  };

  useEffect(() => {
    async function retrieveUserDataFromStorage() {
      init.current = true;
      try {
        setIsLoading(true);
        const userJSON = await getItem();
        if (userJSON) {
          const parsedUser: userDataType = JSON.parse(userJSON);
          const timePassedInSeconds =
            (Date.now() - parsedUser.loggedTimeStamp!) / 1000;
          if (parseInt(parsedUser.expiresIn) - timePassedInSeconds >= 0) {
            mw.fireBaseRequester.setParams({
              idToken: parsedUser.idToken,
              role: parsedUser.role,
            });
            const refreshToken = await mw.userRequester.userRefreshToken(
              parsedUser.refreshToken,
            );
            const loggedTimeStamp = Date.now();
            setUser({
              ...parsedUser,
              loggedTimeStamp,
              refreshToken: refreshToken.refresh_token,
              expiresIn: refreshToken.expires_in,
              idToken: refreshToken.id_token,
              loggedIn: true,
            });
            mw.fireBaseRequester.setParams({
              idToken: refreshToken.id_token,
              role: parsedUser.role,
            });
          } else {
            throw new Error("No user data");
          }
        } else {
          throw new Error("No user data in local storage");
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        removeItem()
          .then(_ => {})
          .catch(_ => {});
        Log.error(TAG, "Failed to get user data", e);
      }
    }
    if (!init.current) {
      retrieveUserDataFromStorage()
        .then(_ => {})
        .catch(e => {});
    }
  }, [getItem]);

  const value = useMemo<UserContextType>(
    () => ({
      user: userContext,
      setUser: setUser,
      logoutUser: logoutUser,
    }),
    [userContext],
  );

  return (
    <UserContext.Provider value={value}>
      <LoadingSpinner isLoading={isLoading} />
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
