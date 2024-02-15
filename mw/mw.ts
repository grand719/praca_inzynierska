import { FireBaseRequester } from "./requesters/FireBaseRequester";
import { RDBRequester } from "./requesters/RDBRequester";
import { UserRequester } from "./requesters/UserRequester";
import StorageData, { storageNames } from "./AsyncStorage";
import { userDataType } from "../context/user-context";
import Log from "../logs/Log";

const TAG = "MW";
class MW {
  private static instance: MW;
  public userRequester: UserRequester;
  public rdbRequester: RDBRequester;
  public storage: StorageData;

  public fireBaseRequester: FireBaseRequester;

  private constructor() {
    this.userRequester = UserRequester.getInstance();
    this.rdbRequester = RDBRequester.getInstance();
    this.fireBaseRequester = FireBaseRequester.instance();
    this.storage = StorageData.getInstance();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new MW();
    return this.instance;
  }
}

const mw = MW.getInstance();

export default mw;
