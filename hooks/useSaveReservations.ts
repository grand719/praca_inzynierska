import { useCallback, useEffect, useState } from "react";
import StorageData, { storageNames } from "../mw/AsyncStorage";
import {
  MappedStuffItemT,
  MappedStuffReservationT,
  StuffReservationT,
} from "../mw/requesters/RDBRequester";
import Log from "../logs/Log";
import mw from "../mw/mw";
import {
  selectedStuffItemMapper,
  selectedStuffReservationMapper,
} from "../mw/mappers/stuffMapper";

const storageInstance = StorageData.getInstance();

type SaveDataT = Pick<StuffReservationT, "reservationShortId" | "stuffItem">;
const TAG = "useSaveReservations";

export const useSaveReservations = (): {
  savedReservation: SaveDataT[];
  reservations: MappedStuffReservationT[];
  fetchedStuffItems: MappedStuffItemT[];
  fetchAdditionalReservationData: (dataInfo: string) => void;
  getSavedData: () => Promise<void>;
  saveReservationNumber: (data: SaveDataT) => Promise<void>;
  fetchByDate: (date: string) => Promise<void>;
} => {
  const [savedReservation, setSavedReservations] = useState<SaveDataT[]>([]);
  const [reservations, setReservations] = useState<MappedStuffReservationT[]>(
    [],
  );
  const [fetchedStuffItems, setFetchedStuffItems] = useState<
    MappedStuffItemT[]
  >([]);

  const fetchByDate = useCallback((date: string) => {
    const dateObject = new Date(date);
    return mw.rdbRequester
      .getReservationListByDate(
        `${dateObject.getDate()}-${dateObject.getMonth()}-${dateObject.getFullYear()}`,
      )
      .then(data => {
        const mappedData = selectedStuffReservationMapper(data);

        const mapToSavedData = mappedData.map(reservationData => ({
          reservationShortId: reservationData.reservationShortId,
          stuffItem: {
            stuffType: reservationData.stuffItem.stuffType,
            itemId: reservationData.stuffItem.itemId,
          },
        }));

        setSavedReservations(mapToSavedData);
      })
      .catch(error => {
        Log.error(TAG, "Failed to fetch by date", error);
      });
  }, []);

  const saveReservationNumber = useCallback(async (data: SaveDataT) => {
    try {
      const savedData = await storageInstance.getData<SaveDataT[]>(
        storageNames.RESERVATIONS,
      );

      if (!savedData) {
        await storageInstance.setData<SaveDataT[]>(storageNames.RESERVATIONS, [
          data,
        ]);
        return;
      }

      await storageInstance.setData<SaveDataT[]>(storageNames.RESERVATIONS, [
        ...savedData,
        data,
      ]);
    } catch (error) {
      Log.error(TAG, "Failed to save data: ", error);
    }
  }, []);

  const getSavedData = useCallback(async () => {
    try {
      const savedData = await storageInstance.getData<SaveDataT[]>(
        storageNames.RESERVATIONS,
      );
      setSavedReservations(savedData || []);
    } catch (error) {
      Log.error(TAG, "Failed to get saved data: ", error);
    }
  }, []);

  const fetchAdditionalReservationData = useCallback(
    (dataInfo: string) => {
      mw.rdbRequester
        .getReservationByCode(dataInfo)
        .then(data => {
          const mappedData = selectedStuffReservationMapper(data);
          setReservations(prev => [...prev, mappedData[0]]);
          const isSavedInLocalStorage = savedReservation.find(
            data =>
              data.reservationShortId === mappedData[0].reservationShortId,
          );

          const isStuffItemFetched = fetchedStuffItems.find(
            data => data.id === mappedData[0].stuffItem.itemId,
          );

          if (!isStuffItemFetched) {
            mw.rdbRequester
              .getStuffItemById(
                mappedData[0].stuffItem.stuffType,
                mappedData[0].stuffItem.itemId,
              )
              .then(stuffData => {
                const mappedStuffItemData = selectedStuffItemMapper({
                  [mappedData[0].stuffItem.itemId]: stuffData,
                });

                setFetchedStuffItems(prev => [...prev, mappedStuffItemData[0]]);
              })
              .catch(e => {
                Log.error(TAG, "Failed to get stuff items", e);
              });
          }
          if (!isSavedInLocalStorage) {
            const newReservationToSave = {
              stuffItem: mappedData[0].stuffItem,
              reservationShortId: mappedData[0].reservationShortId,
            };
            setSavedReservations(prev => [...prev, newReservationToSave]);
            return saveReservationNumber(newReservationToSave);
          }
        })
        .catch(error => {
          Log.error(
            TAG,
            "Failed to fetch additional reservation data: ",
            error,
          );
        });
    },
    [saveReservationNumber, savedReservation],
  );

  return {
    savedReservation,
    reservations,
    fetchedStuffItems,
    fetchAdditionalReservationData,
    getSavedData,
    saveReservationNumber,
    fetchByDate,
  };
};
