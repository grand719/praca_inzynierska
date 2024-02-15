import ScreenGradient from "../components/ScreenGradient";
import UsersTempoSearchForm from "../components/Form/UsersTempoSearchForm";
import { useEffect, useRef, useState } from "react";
import useToast from "../hooks/useToast";
import mw from "../mw/mw";
import { UserDataT } from "./UserDataScreen";
import { userDataMapper } from "../mw/mappers/userMappers";
import Log from "../logs/Log";
import LoadingSpinner from "../components/LoadingSpinner";
import { singleUserTempoMapper, tempoMapper } from "../mw/mappers/tempoMapper";
import { UserMappedTempoT, UserRDBTempoT } from "../mw/requesters/RDBRequester";
import { FlatList } from "react-native";
import TempoTile from "../components/TempoTile";
const TAG = "AllUsersTempoScreen";

function AllUsersTempoScreen() {
  const [tempo, setTempo] = useState<UserMappedTempoT[]>([]);
  const [users, setUsers] = useState<UserDataT[]>([]);
  const [tempoDate, setTempoDate] = useState<string>(String);
  const [selectedUser, setSelectedUSer] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const { setConfirmToast, setErrorToast } = useToast();

  const once = useRef<boolean>(false);

  useEffect(() => {
    if (once.current) {
      return;
    }
    setIsLoading(true);
    mw.userRequester
      .getUsers()
      .then(response => {
        const users: UserDataT[] = userDataMapper(response);
        setUsers(users);
        return mw.rdbRequester.getTempo();
      })
      .then(tempo => {
        setConfirmToast("Successfully fetch users tempo");
        Log.info(TAG, "Successfully get users tempo");
        setTempo(tempoMapper(tempo));
      })
      .catch(e => {
        setIsLoading(false);
        setErrorToast("Failed to fetch users data or tempo");
        Log.error(TAG, "Could not fetch users", e);
      });
    once.current = true;
  }, []);

  function setFilters(date: string, user: string) {
    setTempoDate(date);
    setSelectedUSer(user);
  }

  useEffect(() => {
    if (!once.current) {
      return;
    }
    setIsLoading(true);
    mw.rdbRequester
      .getTempo(tempoDate, selectedUser)
      .then(tempo => {
        setConfirmToast("Successfully fetch users tempo");
        Log.info(TAG, "Successfully get user tempo", tempo);
        let data = [];
        if (selectedUser && tempoDate) {
          data = singleUserTempoMapper(
            tempo as unknown as UserRDBTempoT,
            selectedUser,
          );
        } else {
          data = tempoMapper(tempo);
        }
        setTempo(data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        Log.error(TAG, "Failed to get users tempo: ", error);
      });
  }, [tempoDate, selectedUser]);

  return (
    <ScreenGradient>
      <UsersTempoSearchForm usersData={users} setFilters={setFilters} />
      <LoadingSpinner isLoading={isLoading} />
      {!isLoading && (
        <FlatList
          data={tempo}
          renderItem={({ item }) => (
            <TempoTile
              collectedMoney={item.collectedMoney}
              date={item.date}
              workDone={item.workDone}
              remarks={item.remarks}
              workTime={item.workTime}
              userName={
                users.filter(t => item.userId === t.id)[0]
                  ? users.filter(t => item.userId === t.id)[0].email
                  : ""
              }
            />
          )}
        />
      )}
    </ScreenGradient>
  );
}

export default AllUsersTempoScreen;
