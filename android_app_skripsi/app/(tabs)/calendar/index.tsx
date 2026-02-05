import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import EventSelectedComponent from "@/components/rootComponents/calendarComponent/EventSelectedComponent";
import MonthCalendar from "@/components/rootComponents/calendarComponent/MonthCalendar";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import COLORS from "@/constants/colors";
import { useEvent } from "@/lib/api/hooks/useEvent";
import { EventResponse } from "@/types/event/eventTypes";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

const CalendarPage = () => {
    const router = useRouter();
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(today);
    const { data, isLoading, error, refetch, isFetching } = useEvent().fetchAllEvents();
    const monthScrollRef = useRef<ScrollView>(null);
    const isScrolling = useRef(false);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    };

    const isToday = (date: Date) => {
        return isSameDay(date, new Date());
    };

    const getEventsForDay = (date: Date) => {
        if (!data?.data) return [];

        return data.data.filter((event: EventResponse) => {
            const mainMatch = event.eventDate && isSameDay(new Date(event.eventDate), date);

            const occurrenceMatch = event.occurrences?.some(o =>
                !o.isCancelled &&
                isSameDay(new Date(o.date), date)
            );

            return mainMatch || occurrenceMatch;
        });
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

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        const todayDate = new Date();
        setCurrentMonth(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));
        setSelectedDay(todayDate);

        await refetch();

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };

    useEffect(() => {
        if (showSkeleton || isLoading) return;

        const timer = setTimeout(() => {
            if (monthScrollRef.current) {
                monthScrollRef.current.scrollTo({ 
                    x: width * 2, 
                    animated: false 
                });
            }
            isScrolling.current = false;
        }, 100);

        return () => clearTimeout(timer);
    }, [currentMonth, showSkeleton, isLoading]);

    if (isLoading || showSkeleton) {
        return (
            <View style={calendarStyles.container}>
                <View style={calendarStyles.header}>
                    <SkeletonBox width={40} height={40} borderRadius={20} />
                    <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
                </View>
                <View style={calendarStyles.monthCalendarContainer}>
                    <View style={calendarStyles.headerMonth}>
                        <SkeletonBox width={60} height={30} borderRadius={10} />
                        <SkeletonBox width={80} height={20} borderRadius={10} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <SkeletonBox width={20} height={20} borderRadius={10} />
                            <SkeletonBox width={20} height={20} borderRadius={10} />
                        </View>
                    </View>

                    <View style={calendarStyles.dayContainer}>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                            <View
                                key={i}
                                style={{ flex: 1, alignItems: 'center', }}
                            >
                                <SkeletonBox width={40} height={20} borderRadius={10} />
                            </View>
                        ))}
                    </View>

                    <View style={calendarStyles.dayContainer}>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                            <View
                                key={i}
                                style={{ flex: 1, alignItems: 'center', }}
                            >
                                <SkeletonBox width={20} height={20} borderRadius={10} />
                            </View>
                        ))}
                    </View>

                    <View style={calendarStyles.dayContainer}>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                            <View
                                key={i}
                                style={{ flex: 1, alignItems: 'center', }}
                            >
                                <SkeletonBox width={20} height={20} borderRadius={10} />
                            </View>
                        ))}
                    </View>

                    <View style={calendarStyles.dayContainer}>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                            <View
                                key={i}
                                style={{ flex: 1, alignItems: 'center', }}
                            >
                                <SkeletonBox width={20} height={20} borderRadius={10} />
                            </View>
                        ))}
                    </View>

                    <View style={calendarStyles.dayContainer}>
                        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                            <View
                                key={i}
                                style={{ flex: 1, alignItems: 'center', }}
                            >
                                <SkeletonBox width={20} height={20} borderRadius={10} />
                            </View>
                        ))}
                    </View>

                    <View style={[calendarStyles.eventSelected, {gap: 10}]}>
                        <SkeletonBox width={60} height={20} borderRadius={10} />
                        <SkeletonBox width={90} height={30} borderRadius={10} />
                    </View>
                </View>
                
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <SkeletonBox width={100} height={60} borderRadius={10} style={{ width: "90%" }} />
                </View>
            </View>
        );
    }

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
                refreshControl={
                <RefreshControl
                    refreshing={refreshing || isFetching}
                    onRefresh={onRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                />
            }
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