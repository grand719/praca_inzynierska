/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";

import {
  rdbRequesterEndpoints,
  userRequesterEndpoints,
} from "./requesterTypes";
import { methods } from "./requesterTypes";

const FIREABASE_KEY = "AIzaSyB2x2qqvx2E4hWefgBXMC293e4qJYg4Kpc";

export enum contentTypeE {
  TEXT_JSNO = "text/json",
  APPLICATION_JSON = "application/json",
  URL_ENCODED = "application/x-www-form-urlencoded",
}

export class FireBaseRequester {
  private static reference: FireBaseRequester;
  idToken = "";
  role = "";

  private constructor() {
    return;
  }

  async userRequester<T, E>(
    method: methods,
    url: userRequesterEndpoints | rdbRequesterEndpoints | string,
    data: T,
    contentType?: contentTypeE,
  ): Promise<E> {
    if (method === methods.GET) {
      const response = await axios.get<E>(url + FIREABASE_KEY);
      return response.data;
    }

    if (contentType === contentTypeE.URL_ENCODED) {
      const response = await axios.post<E>(
        url + FIREABASE_KEY,
        //@ts-ignore
        new URLSearchParams(data),
        {
          headers: {
            "content-type": contentType || "application/json",
          },
        },
      );

      return response.data;
    }

    const response = await axios.post<E>(
      url + FIREABASE_KEY,
      {
        ...data,
        returnSecureToken: true,
      },
      {
        headers: {
          "content-type": contentType || "application/json",
        },
      },
    );

    return response.data;
  }

  async rdbRequester<T, E>(
    method: methods,
    url: userRequesterEndpoints | rdbRequesterEndpoints | string,
    data?: T,
    contentType?: contentTypeE,
  ): Promise<E> {
    if (method === methods.GET) {
      const response = await axios.get<E>(url);
      return response.data;
    }

    if (method === methods.PATCH) {
      const response = await axios.patch<E>(url, data);
      return response.data;
    }

    if (method === methods.DELETE) {
      const response = await axios.delete<E>(url);
      return response.data;
    }

    const response = await axios.post<E>(url, data, {
      headers: {
        "content-type": contentType || "application/json",
      },
    });

    return response.data;
  }

  setParams(data: { idToken: string; role: string }) {
    this.idToken = data.idToken;
    this.role = data.role;
  }

  public static instance() {
    if (this.reference) {
      return this.reference;
    }

    this.reference = new FireBaseRequester();
    return this.reference;
  }
}
