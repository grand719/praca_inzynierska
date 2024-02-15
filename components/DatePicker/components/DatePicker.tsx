import { FC, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  UIManager,
  Platform,
  Animated,
} from "react-native";

import IconButton from "./IconButton";
import { useSwipe } from "../hooks/useSwipe";
import { useSwipeAnimation } from "../hooks/useSwipeAnimation";
import { getCalendarDays, months } from "../utils/getCurrentMonth";
import Colors from "../../../constants/Colors";

type DatePickerProps = {
  onPress: (value: Date) => void;
  value?: Date;
};

type DateCellType = {
  date: Date;
  selected: boolean;
  prevMonth: boolean;
  setSelectedCell: (date: Date) => void;
};

const DateCell: FC<DateCellType> = ({
  date,
  selected,
  prevMonth,
  setSelectedCell,
}) => {
  function onPress() {
    setSelectedCell(date);
  }

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.dateCellContainer, selected && styles.selectedDay]}>
        <Text
          style={[
            styles.dateCellText,
            selected && styles.selectedDayText,
            prevMonth && styles.prevMonth,
          ]}>
          {date.getDate()}
        </Text>
      </View>
    </Pressable>
  );
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DatePicker: FC<DatePickerProps> = ({ onPress, value }) => {
  const date = new Date();
  const [month, setMonth] = useState<number>(date.getMonth());
  const [year, setYear] = useState<number>(date.getFullYear());
  const [selectedDay, setSelectedDay] = useState<Date>(value || new Date());

  const currentMonthDays = useMemo<Date[]>(
    () => getCalendarDays(year, month),
    [month],
  );
  const { swipeLeft, swipeRight, swipeData } = useSwipeAnimation(0, 0, 250, 20);

  function onDateSelectHandler(valueDate: Date) {
    setSelectedDay(valueDate);
    console.log(valueDate.toDateString());
    onPress(valueDate);
  }

  function renderDateCell({ item }: { item: Date }) {
    return (
      <DateCell
        date={item}
        selected={selectedDay.toDateString() === item.toDateString()}
        prevMonth={item.getMonth() !== month}
        setSelectedCell={onDateSelectHandler}
      />
    );
  }

  function onNextMonth() {
    setMonth(prev => {
      if (prev + 1 > 11) {
        setYear(prevYear => prevYear + 1);
        return 0;
      }
      return prev + 1;
    });
    swipeRight();
  }

  function onPreviousMonth() {
    setMonth(prev => {
      if (prev - 1 < 0) {
        setYear(prevYear => prevYear - 1);
        return 11;
      }
      return prev - 1;
    });
    swipeLeft();
  }
  const { onTouchEnd, onTouchStart } = useSwipe(onPreviousMonth, onNextMonth);
  return (
    <View
      style={styles.wrapper}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back-circle"
          size={25}
          onPress={onPreviousMonth}
          color={Colors.defaultColors.text}
        />
        <View style={styles.headerText}>
          <Text style={[styles.text, styles.title]}>{months[month]}</Text>
          <Text style={styles.text}>{year}</Text>
        </View>
        <IconButton
          icon="arrow-forward-circle"
          size={25}
          onPress={onNextMonth}
          color={Colors.defaultColors.text}
        />
      </View>
      <View style={styles.wrapperDate}>
        <Animated.View
          style={[styles.wrapperDateAbsolute, { left: swipeData }]}>
          <FlatList
            data={currentMonthDays}
            renderItem={renderDateCell}
            numColumns={7}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    color: Colors.defaultColors.text,
  },
  dateCellContainer: {
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  wrapper: {
    borderWidth: 2,
    borderColor: Colors.defaultColors.border,
    backgroundColor: Colors.defaultColors.backGround,
    borderRadius: 10,
    padding: 15,
  },
  header: {
    backgroundColor: Colors.defaultColors.focus,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 50 * 7,
    paddingHorizontal: 6,
    marginBottom: 15,
    borderRadius: 8,
  },
  headerText: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
  wrapperDate: {
    width: 50 * 7,
    height: 50 * 6,
  },
  wrapperDateAbsolute: {
    width: 50 * 7,
    height: 50 * 6,
    position: "absolute",
    left: 0,
  },
  prevMonth: {
    color: Colors.defaultColors.text,
    opacity: 0.5,
  },
  selectedDay: {
    backgroundColor: Colors.defaultColors.focus,
    justifyContent: "center",
    borderRadius: 13,
  },
  selectedDayText: {
    color: Colors.defaultColors.text,
  },
  dateCellText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    color: Colors.defaultColors.text,
  },
});
