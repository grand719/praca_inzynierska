import { rdbRequesterEndpoints } from "./requesterTypes";
import { FireBaseRequester } from "./FireBaseRequester";
import { methods } from "./requesterTypes";
import { userDataType } from "../../context/user-context";

type UserTempoT = {
  remarks: string;
  workDone: string;
  date: string;
  endTime: string;
  startTime: string;
  collectedMoney: number;
};

export type UserScheduleT = {
  date: Date | string;
  dateFrom: string;
  dateTo: string;
  userName: string;
};

export type UserScheduleDataT = Record<
  string,
  Record<string, Record<string, UserScheduleT>>
>;

export type UserMappedTempoT = {
  userId: string;
  workTime: string;
} & UserTempoT;

export type UsersRDBTempoT = Record<
  string,
  Record<string, Record<string, UserTempoT>>
>;

type NotificationUserT = {
  uid: string;
  userName: string;
};

interface NotificationDataT {
  title: string;
  message: string;
}

export interface NotificationT extends NotificationDataT {
  seenBy: NotificationUserT[];
}

export interface MappedNotificationT extends NotificationT {
  id: string;
}

export interface StuffTypesT {
  name: string;
  rentable: boolean;
}

export interface MappedStuffTypesT extends StuffTypesT {
  id: string;
}

export type StuffReservationT = {
  startRent: number;
  endRent: number;
  clientEmail: string;
  isCanceled: boolean;
  isDone: boolean;
  date?: string;
  reservationShortId: string;
  stuffItem: {
    stuffType: string;
    itemId: string;
  };
};

export interface MappedStuffReservationT extends StuffReservationT {
  id: string;
}

export type StuffRentalT = {
  startRent: number;
  endRent: number;
  clientEmail: string;
  reservationId: string;
  isCanceled: boolean;
  isDone: boolean;
};

export interface StuffItemT {
  stuffType: StuffTypesT;
  name: string;
  description: string;
  stuffRental: StuffRentalT[];
  price: number;
}

export interface MappedStuffItemT extends StuffItemT {
  id: string;
}

export type UserRDBTempoT = Record<string, Record<string, UserTempoT>>;

export class RDBRequester {
  private static reference: RDBRequester;
  fireBaseRequester = FireBaseRequester.instance();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  async addUserSchedule(
    userId: string,
    data: UserScheduleT,
  ): Promise<UserScheduleT> {
    const dateString =
      typeof data.date !== "string"
        ? `${data.date.getMonth() + 1}-${data.date.getFullYear()}`
        : "";

    const response = await this.fireBaseRequester.rdbRequester<
      UserScheduleT,
      UserScheduleT
    >(
      methods.POST,
      `${rdbRequesterEndpoints.RDB}schedule/${dateString}/${userId}/userSchedule.json?auth=${this.fireBaseRequester.idToken}`,
      {
        ...data,
        date: typeof data.date !== "string" ? data.date.toDateString() : "",
      },
    );

    return response;
  }

  async addUserTempo(userId: string, data: UserTempoT): Promise<UserTempoT> {
    const date = new Date();
    const dateString = `${date.getMonth() + 1}-${date.getFullYear()}`;
    const response = await this.fireBaseRequester.rdbRequester<
      UserTempoT,
      UserTempoT
    >(
      methods.POST,
      `${rdbRequesterEndpoints.RDB}tempo/${dateString}/${userId}/userTempo.json?auth=${this.fireBaseRequester.idToken}`,
      data,
    );

    return response;
  }

  async getUserTempo(userId: string, date: string): Promise<UsersRDBTempoT[]> {
    const response = await this.fireBaseRequester.rdbRequester<
      undefined,
      UsersRDBTempoT[]
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}tempo/${date}/${userId}/userTempo.json?auth=${this.fireBaseRequester.idToken}`,
    );
    return response;
  }

  async getUserSchedule(date: string): Promise<UserScheduleDataT> {
    const response = await this.fireBaseRequester.rdbRequester<
      undefined,
      UserScheduleDataT
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}schedule/${date}.json?auth=${this.fireBaseRequester.idToken}`,
    );
    return response;
  }

  async deleteNotification(id: string): Promise<void> {
    const response = await this.fireBaseRequester.rdbRequester<
      undefined,
      undefined
    >(
      methods.DELETE,
      `${rdbRequesterEndpoints.RDB}notifications/${id}.json?auth=${this.fireBaseRequester.idToken}`,
    );

    return response;
  }

  async sendNotifications(data: NotificationT): Promise<NotificationT> {
    const response = await this.fireBaseRequester.rdbRequester<
      NotificationT,
      NotificationT
    >(
      methods.POST,
      `${rdbRequesterEndpoints.RDB}notifications.json?auth=${this.fireBaseRequester.idToken}`,
      { ...data },
    );

    return response;
  }
  async pullNotifications(): Promise<Record<string, NotificationT>> {
    const response = await this.fireBaseRequester.rdbRequester<
      undefined,
      Record<string, NotificationT>
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}notifications.json?auth=${this.fireBaseRequester.idToken}`,
    );

    return response;
  }

  async markAsReade(
    notification: MappedNotificationT,
    userData: userDataType,
  ): Promise<void> {
    return await this.fireBaseRequester.rdbRequester<
      Pick<NotificationT, "seenBy">,
      undefined
    >(
      methods.PATCH,
      `${rdbRequesterEndpoints.RDB}notifications/${notification.id}.json?auth=${this.fireBaseRequester.idToken}`,
      {
        seenBy: [
          ...notification.seenBy,
          { uid: userData.localId, userName: userData.email },
        ],
      },
    );
  }

  async addStuff(data: StuffTypesT): Promise<StuffTypesT> {
    return await this.fireBaseRequester.rdbRequester<StuffTypesT, StuffTypesT>(
      methods.POST,
      `${rdbRequesterEndpoints.RDB}stuff.json?auth=${this.fireBaseRequester.idToken}`,
      { ...data },
    );
  }

  async updateStuffType(
    id: string,
    stuffName: string,
    isRentable: boolean,
  ): Promise<void> {
    return await this.fireBaseRequester.rdbRequester<
      Partial<StuffTypesT>,
      undefined
    >(
      methods.PATCH,
      `${rdbRequesterEndpoints.RDB}stuff/${id}.json?auth=${this.fireBaseRequester.idToken}`,
      { rentable: isRentable },
    );
  }

  async getStuff(): Promise<Record<string, StuffTypesT>> {
    return await this.fireBaseRequester.rdbRequester<
      undefined,
      Record<string, StuffTypesT>
    >(methods.GET, `${rdbRequesterEndpoints.RDB}stuff.json`);
  }

  async deleteStuffType(stuffName: string, id: string): Promise<void[]> {
    return Promise.all([
      await this.fireBaseRequester.rdbRequester<undefined, undefined>(
        methods.DELETE,
        `${rdbRequesterEndpoints.RDB}stuff/${id}.json?auth=${this.fireBaseRequester.idToken}`,
      ),
      await this.fireBaseRequester.rdbRequester<undefined, undefined>(
        methods.DELETE,
        `${rdbRequesterEndpoints.RDB}stuffItems/${stuffName}.json?auth=${this.fireBaseRequester.idToken}`,
      ),
    ]);
  }

  async addStuffItem(stuffItemData: StuffItemT): Promise<StuffItemT> {
    return await this.fireBaseRequester.rdbRequester<StuffItemT, StuffItemT>(
      methods.POST,
      `${rdbRequesterEndpoints.RDB}stuffItems/${stuffItemData.stuffType.name}.json?auth=${this.fireBaseRequester.idToken}`,
      { ...stuffItemData },
    );
  }

  async getStuffItems(): Promise<Record<string, Record<string, StuffItemT>>> {
    return await this.fireBaseRequester.rdbRequester<
      undefined,
      Record<string, Record<string, StuffItemT>>
    >(methods.GET, `${rdbRequesterEndpoints.RDB}stuffItems.json`);
  }

  async getSelectedStuffItems(
    stuffName: string,
  ): Promise<Record<string, StuffItemT>> {
    return await this.fireBaseRequester.rdbRequester<
      undefined,
      Record<string, StuffItemT>
    >(methods.GET, `${rdbRequesterEndpoints.RDB}stuffItems/${stuffName}.json`);
  }

  async getStuffItemById(
    stuffName: string,
    itemId: string,
  ): Promise<StuffItemT> {
    return await this.fireBaseRequester.rdbRequester<undefined, StuffItemT>(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}stuffItems/${stuffName}/${itemId}.json`,
    );
  }

  async updateStuffItems(
    stuffItemData: MappedStuffItemT,
    recordsToUpdate: Partial<StuffItemT>,
  ) {
    return await this.fireBaseRequester.rdbRequester<
      Partial<StuffItemT>,
      undefined
    >(
      methods.PATCH,
      `${rdbRequesterEndpoints.RDB}stuffItems/${stuffItemData.stuffType.name}/${stuffItemData.id}.json`,
      { ...recordsToUpdate },
    );
  }

  async deleteStuffItem(id: string, stuffType: string): Promise<void> {
    return await this.fireBaseRequester.rdbRequester<undefined, undefined>(
      methods.DELETE,
      `${rdbRequesterEndpoints.RDB}stuffItems/${stuffType}/${id}.json?auth=${this.fireBaseRequester.idToken}`,
    );
  }

  async stuffItemRent(
    stuffNewRent: StuffRentalT,
    stuffItem: MappedStuffItemT,
  ): Promise<void> {
    const stuffRental = stuffItem.stuffRental ? stuffItem.stuffRental : [];
    const filteredStuff = stuffRental.filter(
      data => data.reservationId !== stuffNewRent.reservationId,
    );
    return this.updateStuffItems(stuffItem, {
      stuffRental: [...filteredStuff, { ...stuffNewRent }],
    });
  }

  async createReservation(
    code: string,
    data: StuffReservationT,
  ): Promise<{ name: string }> {
    const date = new Date(data.startRent);
    return await this.fireBaseRequester.rdbRequester<
      StuffReservationT & { date: string },
      { name: string }
    >(methods.POST, `${rdbRequesterEndpoints.RDB}reservation.json`, {
      ...data,
      date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
    });
  }

  async getReservationByCode(
    code: string,
  ): Promise<Record<string, StuffReservationT>> {
    return await this.fireBaseRequester.rdbRequester<
      undefined,
      Record<string, StuffReservationT>
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}reservation.json?orderBy="reservationShortId"&equalTo="${code}"`,
    );
  }

  async getReservationListByDate(
    date: string,
  ): Promise<Record<string, StuffReservationT>> {
    return await this.fireBaseRequester.rdbRequester<
      undefined,
      Record<string, StuffReservationT>
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}reservation.json?orderBy="date"&equalTo="${date}"`,
    );
  }

  async updateReservationStatus(
    _code: string,
    id: string,
    itemData: MappedStuffItemT,
    shouldCancel: boolean,
  ): Promise<void[]> {
    const promiseArray = [];

    const rentalObjectToCancel = itemData.stuffRental.find(
      data => data.reservationId === id,
    );

    const cancelReservation = await this.fireBaseRequester.rdbRequester<
      { isCanceled?: boolean; isDone?: boolean },
      undefined
    >(methods.PATCH, `${rdbRequesterEndpoints.RDB}reservation/${id}.json`, {
      ...(shouldCancel ? { isCanceled: true } : { isDone: true }),
    });

    promiseArray.push(cancelReservation);

    if (rentalObjectToCancel) {
      if (shouldCancel) {
        rentalObjectToCancel.isCanceled = true;
      } else {
        rentalObjectToCancel.isDone = true;
      }

      const t = await this.stuffItemRent(rentalObjectToCancel, itemData);
      promiseArray.push(t);
    }

    return Promise.all(promiseArray);
  }

  async getTempo(date?: string, userId?: string): Promise<UsersRDBTempoT> {
    if (this.fireBaseRequester.role !== "admin")
      throw new Error("access denied");

    const defaultDate = new Date();
    const dateString = `${
      defaultDate.getMonth() + 1
    }-${defaultDate.getFullYear()}`;

    const endpointData = [];
    if (date) {
      endpointData.push(date);
    }
    if (!date && userId) {
      endpointData.push(dateString);
    }
    if (!date && !userId) {
      endpointData.push(dateString);
    }

    if (userId) endpointData.push(userId);
    const response = await this.fireBaseRequester.rdbRequester<
      undefined,
      UsersRDBTempoT
    >(
      methods.GET,
      `${rdbRequesterEndpoints.RDB}tempo${
        endpointData.length > 0 ? "/" : ""
      }${endpointData.join("/")}.json?auth=${this.fireBaseRequester.idToken}`,
    );
    return response;
  }

  static getInstance() {
    if (this.reference) {
      return this.reference;
    }

    this.reference = new RDBRequester();
    return this.reference;
  }
}
