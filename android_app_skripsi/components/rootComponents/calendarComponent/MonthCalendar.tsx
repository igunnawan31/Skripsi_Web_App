import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import COLORS from "@/constants/colors";
import { useState } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MonthGridComponent from "./MonthGridComponent";

const { width } = Dimensions.get('window');

type MonthCalendarProps = {
    currentMonth: any;
    setCurrentMonth: any;
    selectedDay: any;
    setSelectedDay: any;
    getEventsForDay: any;
    formatMonthYear: any;
    navigateMonth: any;
    goToToday: any;
    isSameDay: any;
    isToday: any;
    monthScrollRef: any;
    isScrolling: any;
}

const MonthCalendar = ({
    currentMonth,
    setCurrentMonth,
    selectedDay,
    setSelectedDay,
    getEventsForDay,
    formatMonthYear,
    navigateMonth,
    goToToday,
    isSameDay,
    isToday,
    monthScrollRef,
    isScrolling,
}: MonthCalendarProps) => {
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const getMonthsToDisplay = () => {
        const months = [];
        for (let i = -2; i <= 2; i++) {
            const date = new Date(currentMonth);
            date.setMonth(currentMonth.getMonth() + i);
            months.push(date);
        }

        return months;
    };
    const handleMonthScroll = (event: any) => {
        if (isScrolling.current) return;
        
        const offsetX = event.nativeEvent.contentOffset.x;
        const monthIndex = Math.round(offsetX / width);
        
        if (monthIndex === 2) return;
        
        isScrolling.current = true;
        
        const direction = monthIndex - 2;
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
        
        setTimeout(() => {
            monthScrollRef.current?.scrollTo({ x: width * 2, animated: false });
            setTimeout(() => {
                isScrolling.current = false;
            }, 100);
        }, 50);
    };

    const monthsToDisplay = getMonthsToDisplay();

    return (
        <View style={calendarStyles.monthCalendarContainer}>
            <View style={calendarStyles.headerMonth}>
                <TouchableOpacity onPress={goToToday} style={calendarStyles.isToday}>
                    <Text style={calendarStyles.textIsToday}>Today</Text>
                </TouchableOpacity>

                <View>
                    <Text style={calendarStyles.titleMonth}>
                        {formatMonthYear(currentMonth)}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={() => navigateMonth(-1)}>
                        <View style={calendarStyles.inverseLogoHeaderContainer}>
                            <Image
                                style={[calendarStyles.logoHeader, { width: 10, height: 10}]}
                                source={require("../../../assets/icons/arrow-left.png")}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateMonth(1)}>
                        <View style={calendarStyles.inverseLogoHeaderContainer}>
                            <Image
                                style={[calendarStyles.logoHeader, { width: 10, height: 10}]}
                                source={require("../../../assets/icons/arrow-right.png")}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={calendarStyles.dayContainer}>
                {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, i) => (
                    <View key={i} style={{ flex: 1, alignItems: 'center', }}>
                        {day === 'Minggu' || day === 'Sabtu' ? (
                            <Text style={{ fontSize: 12, color: COLORS.primary }}>{day}</Text>
                        ) : (
                            <Text style={{ fontSize: 12, color: COLORS.textPrimary }}>{day}</Text>
                        )}
                    </View>
                ))}
            </View>

            <ScrollView
                ref={monthScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onMomentumScrollEnd={handleMonthScroll}
                scrollEnabled={scrollEnabled}
            >
                {monthsToDisplay.map((monthDate, index) => (
                    <View key={index} style={{ width, paddingHorizontal: 16, paddingBottom: 16 }}>
                        <MonthGridComponent
                            selectedDay={selectedDay}
                            setSelectedDay={setSelectedDay}
                            setCurrentMonth={setCurrentMonth}
                            monthDate={monthDate}
                            getEventsForDay={getEventsForDay}
                            isSameDay={isSameDay}
                            isToday={isToday}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default MonthCalendar;