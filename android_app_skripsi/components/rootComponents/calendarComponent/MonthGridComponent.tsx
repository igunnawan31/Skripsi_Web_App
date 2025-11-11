import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import COLORS from "@/constants/colors";
import { Text, TouchableOpacity, View } from "react-native";

type MonthGridTypeComponent = {
    selectedDay: any;
    setSelectedDay: any;
    setCurrentMonth: any;
    monthDate: Date;
    getEventsForDay: any;
    isSameDay: any;
    isToday: any;
}

const MonthGridComponent = ({selectedDay, setSelectedDay, setCurrentMonth, monthDate, getEventsForDay, isSameDay, isToday}: MonthGridTypeComponent) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // Jumlah hari dalam satu minggu
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Jumlah hari dalam satu bulan
    const lastDatePrevMonth = new Date(year, month, 0).getDate();

    let prevMonthCounter = lastDatePrevMonth - firstDayOfWeek + 1;
    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const clickedDate = new Date(prevYear, prevMonth, prevMonthCounter);

        days.push(
            <TouchableOpacity
                key={`prev-${i}`}
                onPress={() => {
                    setSelectedDay(clickedDate);
                    setCurrentMonth(new Date(prevYear, prevMonth, 1));
                }}
                style={calendarStyles.monthGrid}
            >
                <View style={calendarStyles.prevNextMonthView}>
                    <Text style={calendarStyles.textPrevNext}>
                        {prevMonthCounter}
                    </Text>
                </View>
            </TouchableOpacity>
        );
        prevMonthCounter++;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const hasEvents = getEventsForDay(date).length > 0;
        const isSelected = isSameDay(date, selectedDay);
        const isTodayDate = isToday(date);
    
        days.push(
            <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(date)}
                style={calendarStyles.monthGrid}
            >
                <View style={[calendarStyles.prevNextMonthView, {backgroundColor: isSelected ? COLORS.tertiary : isTodayDate ? COLORS.tertiaryOpacity20 : 'transparent',}]}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: isSelected || isTodayDate ? 'bold' : '400',
                        color: isSelected ? 'white' : isTodayDate ? COLORS.textPrimary : COLORS.textPrimary
                    }}>
                        {day}
                    </Text>
                </View>
                {hasEvents && !isSelected && (
                    <View style={calendarStyles.hasEvent}/>
                )}
            </TouchableOpacity>
        );

        if (days.length === 7) {
            weeks.push(
                <View key={`week-${weeks.length}`} style={{ flexDirection: 'row' }}>
                    {days}
                </View>
            );
            days = [];
        }
    }

    if (days.length > 0) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        let nextMonthCounter = 1;

        while (days.length < 7) {
            const clickedDate = new Date(nextYear, nextMonth, nextMonthCounter);

            days.push(
                <TouchableOpacity
                    key={`next-${nextMonthCounter}`}
                    onPress={() => {
                        setSelectedDay(clickedDate);
                        setCurrentMonth(new Date(nextYear, nextMonth, 1));
                    }}
                    style={calendarStyles.monthGrid}
                >
                    <View
                        style={calendarStyles.prevNextMonthView}>
                        <Text style={calendarStyles.textPrevNext}>
                            {nextMonthCounter}
                        </Text>
                    </View>
                </TouchableOpacity>
            );

            nextMonthCounter++;
        }
        weeks.push(
            <View key={`week-${weeks.length}`} style={{ 
                flexDirection: 'row' 
            }}>
                {days}
            </View>
        );
    }
    return weeks;
};

export default MonthGridComponent;