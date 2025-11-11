import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import EventSelectedComponent from "@/components/rootComponents/calendarComponent/EventSelectedComponent";
import MonthCalendar from "@/components/rootComponents/calendarComponent/MonthCalendar";
import COLORS from "@/constants/colors";
import { dummyCalendar } from "@/data/dummyCalendar";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

const CalendarPage = () => {
    const router = useRouter();
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(today);
    const [events] = useState(dummyCalendar);
    const monthScrollRef = useRef<ScrollView>(null);
    const isScrolling = useRef(false);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    };

    const isToday = (date: Date) => {
        return isSameDay(date, new Date());
    };

    const getEventsForDay = (date: Date) => {
        return events.filter(event => isSameDay(event.start, date))
            .sort((a: any, b: any) => a.start - b.start);
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    };

    const navigateMonth = (direction: any) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newDate);
        setSelectedDay(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    };

    const goToToday = () => {
        const today = new Date();
        const monthNow = new Date(today.getFullYear(), today.getMonth(), 1)
        setCurrentMonth(monthNow);
        setSelectedDay(today);
    };

    useEffect(() => {
        setTimeout(() => {
            monthScrollRef.current?.scrollTo({ x: width * 2, animated: false });
            isScrolling.current = false;
        }, 100);
    }, [currentMonth]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <TouchableOpacity 
                style={calendarStyles.addEvent}
                onPress={() => router.push("/(calendar)/create")}
            >
                <Image
                    style={[calendarStyles.logoHeader, {tintColor: COLORS.white}]}
                    source={require("../../../assets/icons/add.png")}
                />
            </TouchableOpacity>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={calendarStyles.container}>
                    <View style={calendarStyles.header}>
                        <View style={calendarStyles.logoHeaderContainer}>
                            <Image
                                style={calendarStyles.logoHeader}
                                source={require("../../../assets/icons/calendar.png")}
                            />
                        </View>
                        <View>
                            <Text style={calendarStyles.headerTitle}>
                                Kalendar Kantor
                            </Text>
                            <Text style={calendarStyles.headerDescription}>
                                Lihat jadwal kantor dan tim project kalian
                            </Text>
                        </View>
                    </View>
                    <MonthCalendar
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        selectedDay={selectedDay}
                        setSelectedDay={setSelectedDay}
                        getEventsForDay={getEventsForDay}
                        formatMonthYear={formatMonthYear}
                        navigateMonth={navigateMonth}
                        goToToday={goToToday}
                        isSameDay={isSameDay}
                        isToday={isToday}
                        monthScrollRef={monthScrollRef}
                        isScrolling={isScrolling}
                    />
                    <EventSelectedComponent 
                        getEventsForDay={getEventsForDay}
                        selectedDay={selectedDay}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default CalendarPage;