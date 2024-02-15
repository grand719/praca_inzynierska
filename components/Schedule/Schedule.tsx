import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDate } from "./ScheduleHooks";

import DateContainer from "./DateContainer";
import mw from "../../mw/mw";
import {
  EnrichedUserScheduleT,
  scheduleMapper,
} from "../../mw/mappers/scheduleMapper";

const { width } = Dimensions.get("screen");

type ScheduleT = {
  shouldUpdate: boolean;
  updateSchedule: (shouldUpdate: boolean) => void;
  onPress: (data: EnrichedUserScheduleT[]) => void;
};

const Schedule: React.VFC<ScheduleT> = ({
  shouldUpdate,
  updateSchedule,
  onPress,
}) => {
  const { currentDate, getSurroundedMonthsDate, setCurrentDate } = useDate(
    new Date(),
  );
  const [usersSchedule, setUsersSchedule] = useState<EnrichedUserScheduleT[]>(
    [],
  );

  const today = new Date();

  const { prevMonth, nextMonth } = getSurroundedMonthsDate();
  const scrollRef = useRef<ScrollView>(null);

  const onNextMonth = () => {
    setCurrentDate(nextMonth);
  };

  const onPrevMonth = () => {
    setCurrentDate(prevMonth);
  };

  useEffect(() => {
    const stringDate = `${
      currentDate.getMonth() + 1
    }-${currentDate.getFullYear()}`;

    mw.rdbRequester
      .getUserSchedule(stringDate)
      .then(data => {
        setUsersSchedule(scheduleMapper(data));
        updateSchedule(false);
      })
      .catch(e => {
        updateSchedule(false);
        console.log(e);
      });
  }, [currentDate, shouldUpdate, updateSchedule]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        ref={scrollRef}
        scrollEventThrottle={0}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentOffset={{ x: width * 1, y: 0 }}
        onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const position = Math.round(event.nativeEvent.contentOffset.x);
          if (position >= Math.round(width * 2)) {
            scrollRef.current?.scrollTo({
              x: width,
              y: undefined,
              animated: false,
            });
            setCurrentDate(nextMonth);
          }

          if (position === 0) {
            scrollRef.current?.scrollTo({
              x: width,
              y: undefined,
              animated: false,
            });
            setCurrentDate(prevMonth);
          }
        }}
        snapToOffsets={[0, width, width * 2]}>
        <DateContainer
          date={prevMonth}
          onNextMonth={onNextMonth}
          onPrevMonth={onPrevMonth}
          today={today}
        />
        <DateContainer
          date={currentDate}
          onNextMonth={onNextMonth}
          onPrevMonth={onPrevMonth}
          data={usersSchedule}
          today={today}
          onPress={onPress}
        />
        <DateContainer
          date={nextMonth}
          onNextMonth={onNextMonth}
          onPrevMonth={onPrevMonth}
          today={today}
        />
      </ScrollView>
    </View>
  );
};

export default Schedule;
