import {
  MappedStuffItemT,
  MappedStuffReservationT,
  MappedStuffTypesT,
  StuffItemT,
  StuffReservationT,
  StuffTypesT,
} from "../requesters/RDBRequester";

export function stuffMapper(
  data: Record<string, StuffTypesT>,
): MappedStuffTypesT[] {
  const mappedData: MappedStuffTypesT[] = [];

  for (const nid in data) {
    mappedData.push({ ...data[nid], id: nid });
  }

  return mappedData;
}

export function stuffItemMapper(
  data: Record<string, Record<string, StuffItemT>>,
): MappedStuffItemT[] {
  const mappedData: MappedStuffItemT[] = [];

  for (const name in data) {
    for (const nid in data[name]) {
      mappedData.push({ ...data[name][nid], id: nid });
    }
  }

  return mappedData;
}

export function selectedStuffItemMapper(
  data: Record<string, StuffItemT>,
): MappedStuffItemT[] {
  const mappedData: MappedStuffItemT[] = [];

  for (const nid in data) {
    mappedData.push({ ...data[nid], id: nid });
  }

  return mappedData;
}

export function selectedStuffReservationMapper(
  data: Record<string, StuffReservationT>,
): MappedStuffReservationT[] {
  const mappedData: MappedStuffReservationT[] = [];

  for (const nid in data) {
    mappedData.push({ ...data[nid], id: nid });
  }

  return mappedData;
}
