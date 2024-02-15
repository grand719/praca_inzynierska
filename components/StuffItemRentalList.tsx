import React from "react";
import { StuffRentalT } from "../mw/requesters/RDBRequester";
import StuffItemRentalListItem from "./StuffItemRentalListItem";

type StuffItemRentalListProps = {
  data: StuffRentalT[];
};

const StuffItemRentalList = ({ data }: StuffItemRentalListProps) => {
  return (
    <>
      {data.map(itemData => (
        <StuffItemRentalListItem key={itemData.reservationId} data={itemData} />
      ))}
    </>
  );
};

export default StuffItemRentalList;
