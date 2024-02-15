//map firebase user data to fit project user model defined below
import { UserDataT } from "../../screens/UserDataScreen";
import { UsersRDBDataT } from "../requesters/UserRequester";

export const userDataMapper = (response: UsersRDBDataT): UserDataT[] => {
  const a: UserDataT[] = [];
  for (const id in response) {
    for (const key in response[id]) {
      for (const data in response[id][key]) {
        a.push({ ...response[id][key][data], id: id });
      }
    }
  }

  return a;
};
