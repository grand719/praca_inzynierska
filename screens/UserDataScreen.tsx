import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import ScreenGradient from "../components/ScreenGradient";

import UserTile from "../components/UserTile";
import { userDataMapper } from "../mw/mappers/userMappers";
import Log from "../logs/Log";
import mw from "../mw/mw";

import LoadingSpinner from "../components/LoadingSpinner";
import { UserAdditionalDataT } from "../mw/requesters/UserRequester";
import useToast from "../hooks/useToast";

export type UserDataT = UserAdditionalDataT & { id: string };
const TAG = "UserDataScreen";

function UserDataScreen() {
  const [users, setUsers] = useState<UserDataT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setConfirmToast, setErrorToast } = useToast();

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
        setErrorToast("Błąd pobierania danych użytkownika");
        Log.error(TAG, "Could not fetch users", e);
      });
  }, []);

  return (
    <ScreenGradient>
      <FlatList
        data={users}
        keyExtractor={data => data.id}
        renderItem={data => {
          return <UserTile userData={data.item} userId={data.item.id} />;
        }}
      />
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
    </ScreenGradient>
  );
}

export default UserDataScreen;
