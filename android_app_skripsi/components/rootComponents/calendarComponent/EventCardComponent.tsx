import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import { GajiStyles } from "@/assets/styles/rootstyles/gaji/gaji.styles";
import COLORS from "@/constants/colors";
import { useEvent } from "@/lib/api/hooks/useEvent";
import { useAuthStore } from "@/lib/store/authStore";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import { CalendarEventItem} from "@/types/event/eventTypes";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BuatCalendarModalComponent from "./BuatCalendarModalComponent";

type EventCardComponentProps = {
    event: CalendarEventItem;
    onNotify: (v: any) => void;
    onDeleteSuccess: any;
};

const EventCardComponent = ({ event, onNotify, onDeleteSuccess }: EventCardComponentProps) => {
    const dateObj = new Date(event.eventDate);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { mutate, isPending } = useEvent().deleteEvent();
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
        mutate(event.id, {
            onSuccess: () => {
                setShowDeleteModal(false);

                onNotify({
                    visible: true,
                    status: "success",
                    title: "Agenda Berhasil Diubah",
                    description: "Agenda telah diubah, kembali ke daftar agenda.",
                });
                onDeleteSuccess();
            },
            onError: (err: any) => {
                setShowDeleteModal(false);

                onNotify({
                    visible: true,
                    status: "error",
                    title: "Pembaharuan Gagal",
                    description:
                    err?.message || "Terjadi kesalahan saat mengirim pembaharuan.",
                });
            },
        })        
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
                        onPress={() =>
                            router.push({
                                pathname: "/(calendar)/[id]",
                                params: {
                                    id: event.id,
                                    occurrenceId: event.occurrenceId,
                                },
                            })
                        }
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
                                onPress={() =>
                                    router.push({
                                        pathname: "/(calendar)/update/[id]",
                                        params: {
                                            id: event.id,
                                            occurrenceId: event.occurrenceId,
                                        },
                                    })
                                }
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
                                onPress={() => setShowDeleteModal(true)}
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
            <BuatCalendarModalComponent
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onSave={handleDelete}
                title={"Menghapus Agenda"}
                description={"Apakah anda sudah yakin terhadap penghapus saat ini?"}
                textActive={"Ya, Hapus"}
                textPassive={"Batal"}
            />
        </View>
    );
};


export default EventCardComponent;