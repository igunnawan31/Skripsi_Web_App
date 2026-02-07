import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import { Image, ScrollView, Text, View } from "react-native";
import EventCardComponent from "./EventCardComponent";
import COLORS from "@/constants/colors";
import { EventResponse } from "@/types/event/eventTypes";

type EventSelectedComponentProps = {
    getEventsForDay: any;
    selectedDay: any;
    onNotify?: any;
    refreshData?: () => void;
}

const EventSelectedComponent = ({getEventsForDay, selectedDay, onNotify, refreshData}: EventSelectedComponentProps) => {
    const dayEvents = getEventsForDay(selectedDay);

    const isSameDay = (dateA: string, dateB: Date) => {
        const a = new Date(dateA);
        return (
            a.getFullYear() === dateB.getFullYear() &&
            a.getMonth() === dateB.getMonth() &&
            a.getDate() === dateB.getDate()
        );
    };
    
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={calendarStyles.eventSelected}>
                <Text style={[calendarStyles.eventTitle, {color: COLORS.textMuted}]}>
                    {selectedDay.toLocaleDateString('id-ID', { weekday: 'long' })}
                </Text>
                <Text style={calendarStyles.eventDate}>
                    {selectedDay.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={[{ padding: 16 },{ paddingBottom: dayEvents.length > 0 ? 75 : 0}]}>
                {dayEvents.length > 0 ? (
                    dayEvents.flatMap((event: EventResponse) =>
                        event.occurrences
                            .filter((occ) => isSameDay(occ.date, selectedDay))
                            .map((occ) => (
                                <EventCardComponent
                                    key={occ.id}
                                    event={{
                                        ...event,
                                        occurrenceId: occ.id,
                                        eventDate: occ.date,
                                    }}
                                    onNotify={onNotify}
                                    onDeleteSuccess={refreshData}
                                />
                            ))
                    )
                ) : (
                    <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Image 
                            source={require("../../../assets/icons/calendar.png")}
                            style={calendarStyles.logoHeader}
                        /> 
                        <Text style={{ fontSize: 16, color: COLORS.textMuted, marginTop: 16, textAlign: 'center' }}>
                            No events scheduled
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default EventSelectedComponent;