/* eslint-disable @typescript-eslint/no-empty-function */
import AsyncStorage from "@react-native-async-storage/async-storage";
import Log from "../logs/Log";

const TAG = "StorageData";

export enum storageNames {
  USER = "USER",
  RESERVATIONS = "RESERVATIONS",
}

class StorageData {
  private static instance: StorageData;
  private constructor() {}

  async getData<T>(key: string): Promise<T | null> {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      const parsedData: T = JSON.parse(data);
      return parsedData;
    } else {
      return null;
    }
  }
  async setData<T>(key: string, data: T) {
    try {
      const value = JSON.stringify(data);
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      Log.error(TAG, "Failed to set data: ", data);
    }
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new StorageData();
    return this.instance;
  }
}

export default StorageData;
