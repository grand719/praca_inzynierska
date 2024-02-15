import { FlatList, Dimensions } from "react-native";
import React, { useContext } from "react";
import DayCell from "./DayCell";
import { getCalendarDays } from "../DatePicker/utils/getCurrentMonth";
import DateContainerHeader from "./DateContainerHeader";
import DateContainerFooter from "./DateContainerFooter";
import { EnrichedUserScheduleT } from "../../mw/mappers/scheduleMapper";
import { UserContext } from "../../context/user-context";

type DateContainerT = {
  date: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  today: Date;
  data?: EnrichedUserScheduleT[];
  onPress?: (data: EnrichedUserScheduleT[]) => void;
};

export const { width: CONTAINER_WIDTH } = Dimensions.get("screen");

const DateContainer: React.VFC<DateContainerT> = ({
  date,
  onPrevMonth,
  onNextMonth,
  today,
  data,
  onPress,
}) => {
  const ctx = useContext(UserContext);

  const renderItems = ({ item }: { item: Date }) => {
    const myWorkDay = data?.some(
      schedule =>
        schedule.id === ctx.user.localId &&
        schedule.date === item.toDateString(),
    );

    const othersWorkDay = data?.some(
      schedule =>
        schedule.id !== ctx.user.localId &&
        schedule.date === item.toDateString(),
    );

    const dayData = data?.filter(
      schedule => schedule.date === item.toDateString(),
    );

    return (
      <DayCell
        date={item}
        size={Math.round(CONTAINER_WIDTH / 7 - 5)}
        isPrevMonth={item.getMonth() === date.getMonth()}
        isCurrentDay={today.toDateString() === item.toDateString()}
        isMyWorkDay={myWorkDay}
        data={dayData || []}
        onPress={onPress}
        isAnyEmployeeWorkDay={othersWorkDay}
      />
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <DateContainerHeader
          title={`${date.getMonth() + 1}/${date.getFullYear()}`}
          onNextMonth={onNextMonth}
          onPrevMonth={onPrevMonth}
        />
      }
      ListFooterComponent={DateContainerFooter}
      style={{
        width: CONTAINER_WIDTH,
      }}
      data={getCalendarDays(date.getFullYear(), date.getMonth())}
      contentContainerStyle={{
        padding: 10,
      }}
      numColumns={7}
      renderItem={renderItems}
    />
  );
};

export default DateContainer;
