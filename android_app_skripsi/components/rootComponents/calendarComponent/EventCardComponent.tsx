import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import COLORS from "@/constants/colors";
import { Text, TouchableOpacity } from "react-native";

type Event = {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

type EventCardComponentProps = {
    event: Event;
}

const EventCardComponent = ({event}: EventCardComponentProps) => {
    const startTime = event.start.toLocaleTimeString('id-ID', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    const endTime = event.end.toLocaleTimeString('id-ID', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });

    return (
        <TouchableOpacity
            key={event.id}
            style={calendarStyles.cardEvent}
        >
            <Text style={calendarStyles.eventTitle}>
                {event.title}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
                {startTime} - {endTime}
            </Text>
        </TouchableOpacity>
    );
};

export default EventCardComponent;