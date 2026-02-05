import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import { GajiStyles } from "@/assets/styles/rootstyles/gaji/gaji.styles";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/lib/store/authStore";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import { EventResponse } from "@/types/event/eventTypes";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type EventCardComponentProps = {
    event: EventResponse;
}

const EventCardComponent = ({ event }: EventCardComponentProps) => {
    const dateObj = new Date(event.eventDate);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const [openInformation, setOpenInformation] = useState(false);
    
    const canManageEvent = useMemo(() => {
        if (!user) return false;

        if (user.majorRole === MajorRole.OWNER) return true;

        if (
            user.majorRole === MajorRole.KARYAWAN &&
            (user.minorRole === MinorRole.HR ||
            user.minorRole === MinorRole.PROJECT_MANAGER)
        ) {
            return true;
        }

        return false;
    }, [user]);

    const handleDelete = () => {

    }

    const time = dateObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>
                    Memuat data user...
                </Text>
            </View>
        );
    }

    return (
        <View
            key={event.id} 
            style={calendarStyles.masterCardEvent}
        >
            <View style={calendarStyles.cardEvent}>
                <View>
                    <Text style={calendarStyles.eventTitle}>
                        {event.title}
                    </Text>
                    <Text style={{ fontSize: 14, color: COLORS.textMuted }}>
                        {time}
                    </Text>
                </View>
                {!openInformation ? (
                    <TouchableOpacity
                        onPress={() => setOpenInformation(true)}
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 5,
                        }}
                    >
                        <View style={{ width: 28, height: 28, borderRadius:14, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" }}>
                            <Image
                                style={GajiStyles.iconCalendar}
                                source={require('../../../assets/icons/arrow-right.png')}
                            />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => setOpenInformation(false)}
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 5,
                        }}
                    >
                        <View style={{ width: 28, height: 28, borderRadius:14, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" }}>
                            <Image
                                style={GajiStyles.iconCalendar}
                                source={require('../../../assets/icons/close.png')}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            {openInformation && (
                <View style={{ flexDirection: "row", gap: 5, justifyContent: "flex-end" }}>
                    <TouchableOpacity
                        onPress={() => router.push(`/(calendar)/${event.id}`)}
                        style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 5,
                        }}
                    >
                        <View style={{ width: "auto", height: 28, borderRadius:14, backgroundColor: COLORS.tertiary, justifyContent: "center", alignItems: "center", flexDirection: "row", paddingHorizontal: 10, gap: 5}}>
                            <Image
                                style={GajiStyles.iconCalendar}
                                source={require('../../../assets/icons/eyes-open.png')}
                            />
                            <Text style={{ color: COLORS.white }}>Details</Text>
                        </View>
                    </TouchableOpacity>
                    {canManageEvent && (
                        <>
                            <TouchableOpacity
                                onPress={() => router.push(`/(calendar)/update/${event.id}`)}
                                style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: 5,
                                }}
                            >
                                <View style={{ width: "auto", height: 28, borderRadius:14, backgroundColor: COLORS.secondary, justifyContent: "center", alignItems: "center", flexDirection: "row", paddingHorizontal: 10, gap: 5}}>
                                    <Image
                                        style={GajiStyles.iconCalendar}
                                        source={require('../../../assets/icons/edit.png')}
                                    />
                                    <Text style={{ color: COLORS.white }}>Update</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete()}
                                style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: 5,
                                }}
                            >
                                <View style={{ width: "auto", height: 28, borderRadius:14, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", flexDirection: "row", paddingHorizontal: 10, gap: 5}}>
                                    <Image
                                        style={GajiStyles.iconCalendar}
                                        source={require('../../../assets/icons/trash.png')}
                                    />
                                    <Text style={{ color: COLORS.white }}>Delete</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </View>
    );
};


export default EventCardComponent;