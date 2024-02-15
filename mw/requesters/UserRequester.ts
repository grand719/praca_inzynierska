/* eslint-disable @typescript-eslint/no-for-in-array */
import Log from "../../logs/Log";

import {
  userRequesterEndpoints,
  methods,
  rdbRequesterEndpoints,
} from "./requesterTypes";
import { contentTypeE, FireBaseRequester } from "./FireBaseRequester";

const TAG = "UserRequester";

type UserData = {
  email: string;
  password: string;
};

type UserDataExtended = {
  email: string;
  password: string;
};

export type UserT = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
};

type RegisteredUserT = {
  idToken: string;
  email: string;
  refresh_token: string;
  expiresIn: string;
  localId: string;
};

export type UsersT = {
  localId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  providerUserInfo: Record<string, string>;
  photoUrl: string;
  passwordHash: string;
  passwordUpdatedAt: number;
  validSince: string;
  disabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  customAuth: boolean;
};

type ChangePasswordT = {
  idToken: string;
  password: string;
};

type RefreshTokenT = {
  grant_type: "refresh_token";
  refresh_token: string;
};

type RefreshTokenResponseT = {
  expires_in: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
};

export type UsersRDBDataT = Record<
  string,
  Record<string, Record<string, UserAdditionalDataT>>
>;

export type UserAdditionalDataT = {
  name: string;
  surname: string;
  phoneNumber: string;
  salary: number;
  email: string;
  role: string;
};

export class UserRequester {
  private static reference: UserRequester;
  refreshToken = "";
  fireBaseRequester = FireBaseRequester.instance();

  private constructor() {
    console.log("Create instance");
  }

  registerNewUser = async (
    data: UserData,
    additionalData: UserAdditionalDataT,
  ) => {
    try {
      const userData = await this.fireBaseRequester.userRequester<
        UserDataExtended,
        RegisteredUserT
      >(methods.POST, userRequesterEndpoints.SIGN_UP_URL, data);

      await this.fireBaseRequester.rdbRequester(
        methods.POST,
        `${rdbRequesterEndpoints.RDB}users/${userData.localId}/userData.json?auth=${userData.idToken}`,
        additionalData,
      );
      Log.info(TAG, "User add: ", data.email);
    } catch (e) {
      Log.error(TAG, "Failed to register new account", e);
    }
  };

  signInUser = async (
    data: UserData,
  ): Promise<{ user: UserT; additionalData: UserAdditionalDataT }> => {
    const response = await this.fireBaseRequester.userRequester<
      UserData,
      UserT
    >(methods.POST, userRequesterEndpoints.SIGN_IN_URL, data);

    if (response.idToken) {
      this.fireBaseRequester.idToken = response.idToken;
      this.refreshToken = response.refreshToken;
    }
    const userAdditionalDataResponse = await this.getUserData(response.localId);

    const dataUserKeys = Object.keys(userAdditionalDataResponse);
    const dataUser = userAdditionalDataResponse[dataUserKeys[0]];

    if (dataUser) {
      this.fireBaseRequester.role = dataUser.role;
    }

    return {
      user: response,
      additionalData: dataUser,
    };
  };

  getUsers = async (): Promise<UsersRDBDataT> => {
    if (this.fireBaseRequester.role !== "admin")
      throw new Error("access denied");

    const response = await this.fireBaseRequester.rdbRequester<
      any,
      UsersRDBDataT
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}users.json?auth=${this.fireBaseRequester.idToken}`,
    );

    return response;
  };

  sendResetPasswordEmail = async (
    userEmail: string,
  ): Promise<{ email: string }> => {
    const response = await this.fireBaseRequester.userRequester<
      { requestType: string; email: string },
      { email: string }
    >(methods.POST, userRequesterEndpoints.RESET_EMAIL, {
      requestType: "PASSWORD_RESET",
      email: userEmail,
    });

    return response;
  };

  userChangePassword = async (data: ChangePasswordT): Promise<UserT> => {
    const response = await this.fireBaseRequester.userRequester<
      ChangePasswordT,
      UserT
    >(methods.POST, userRequesterEndpoints.CHANGE_PASSWORD, {
      ...data,
      idToken: this.fireBaseRequester.idToken,
    });

    if (response) {
      this.fireBaseRequester.idToken = response.idToken;
      this.refreshToken = response.refreshToken;
    }

    return response;
  };

  userRefreshToken = async (refresh_token?: string) => {
    if (!this.refreshToken) {
      if (refresh_token?.length) {
        this.refreshToken = refresh_token;
      } else {
        return Promise.reject("Refresh token is null");
      }
    }

    const response = await this.fireBaseRequester.userRequester<
      RefreshTokenT,
      RefreshTokenResponseT
    >(methods.POST, userRequesterEndpoints.REFRESH_TOKEN, {
      grant_type: "refresh_token",
      refresh_token: refresh_token ? refresh_token : this.refreshToken,
    });

    return response;
  };

  async getUserData(userId: string) {
    const response = await this.fireBaseRequester.rdbRequester<
      any,
      Record<string, UserAdditionalDataT>
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}users/${userId}/userData.json?auth=${this.fireBaseRequester.idToken}`,
    );

    return response;
  }

  static getInstance() {
    if (this.reference) {
      return this.reference;
    }

    this.reference = new UserRequester();
    return this.reference;
  }
}
