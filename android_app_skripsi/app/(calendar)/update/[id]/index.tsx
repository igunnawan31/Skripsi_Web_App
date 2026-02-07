import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform, RefreshControl } from "react-native";
import COLORS from "@/constants/colors";
import SearchDropdownComponent from "@/components/rootComponents/calendarComponent/SearchDropdownComponent";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import BuatCalendarModalComponent from "@/components/rootComponents/calendarComponent/BuatCalendarModalComponent";
import { CreateEventRequest, EventFreq, EventOccurrence, FormDataEvent } from "@/types/event/eventTypes";
import { useEvent } from "@/lib/api/hooks/useEvent";
import { ProjectResponse, ProjectTeams } from "@/types/project/projectTypes";
import { useAuthStore } from "@/lib/store/authStore";
import { useProject } from "@/lib/api/hooks/useProject";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import NotificationModal from "@/components/rootComponents/NotificationModal";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import { GajiStyles } from "@/assets/styles/rootstyles/gaji/gaji.styles";

const UpdateEventFormPage = () => {
    const user = useAuthStore((state) => state.user);
    const { id, occurrenceId } = useLocalSearchParams<{
        id: string;
        occurrenceId?: string;
    }>();
    const idParam = Array.isArray(id) ? id[0] : id ?? "";
    const router = useRouter();

    const [showAgendaModal, setShowAgendaModal] = useState(false);
    const [showOccurencesModal, setShowOccurencesModal] = useState(false);
    const [showBackModal, setShowBackModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);

    const { data: detailData, isLoading: isDetailLoading, error: detailError,  refetch, isFetching: isFetchingEvent } = useEvent().fetchEventById(idParam);
    const { data: projectResponse, isLoading, error: errorProject, isFetching: isFetchingProject } = useProject().fetchAllProject();
    const { updateEvents, updateOccurrences} = useEvent();
    const updateAgendaMutation = updateEvents();
    const updateOccurrenceMutation = updateOccurrences();
    
    const [isOccurent, setIsOccurent] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
    const [selectedOccurrence, setSelectedOccurrence] = useState<EventFreq | null>(null);
    const [selectedOccurrenceId, setSelectedOccurrenceId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalOccurenceVisible, setModalOccurenceVisible] = useState(false);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>
                    Memuat data user...
                </Text>
            </View>
        );
    }

    const freqOptions = Object.values(EventFreq);
    const [notification, setNotification] = useState<{
        visible: boolean;
        status: "success" | "error";
        title?: string;
        description?: string;
    }>({
        visible: false,
        status: "success",
    });

    const [formData, setFormData] = useState<FormDataEvent>({
        title: "",
        date: "",
        time: "",
        projectId: null,
        frequency: null, 
    });

    const buildISODate = () => {
        const data = formData;
        console.log(data);

        if (!data.date || !data.time) return "";

        return new Date(`${data.date}T${data.time}`).toISOString();
    };

    const isRecurring = isOccurent;
    console.log("detail", detailData);
    const projects = projectResponse?.data ?? [];
    let availableTargets: ProjectResponse[] = [];

    if ( user.majorRole === MajorRole.OWNER) {
        availableTargets = projects;
    } 
    else if (user.majorRole === MajorRole.KARYAWAN) {
        if (user.minorRole === MinorRole.HR) {
            availableTargets = projects;
        }
        if (user.minorRole === MinorRole.PROJECT_MANAGER) {
            availableTargets = projects.filter((p: ProjectResponse) =>
                p.projectTeams?.some((team: ProjectTeams) => team.userId === user.id)
            );
        }
    }

    const isProjectRequired = () => {
        if (user.majorRole === MajorRole.OWNER) return false;

        if (user.majorRole === MajorRole.KARYAWAN) {
            if (user.minorRole === MinorRole.HR) return false;
            if (user.minorRole === MinorRole.PROJECT_MANAGER) return true;
        }

        return false;
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) tempErrors.title = "Judul agenda wajib diisi.";
        if (!formData.date) tempErrors.date = "Tanggal agenda wajib diisi.";
        if (!formData.time) tempErrors.time = "Waktu agenda wajib diisi.";

        if (isProjectRequired() && !formData.projectId) {
            tempErrors.projectId = "Project wajib dipilih untuk Project Manager.";
        }

        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const onDateChange = (_: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formatted = selectedDate.toISOString().split("T")[0];
            setFormData(prev => ({ ...prev, date: formatted }));
        }
    };

    const onTimeChange = (_: any, selectedTime?: Date) => {
        setShowStartPicker(false);
        if (selectedTime) {
            const hh = String(selectedTime.getHours()).padStart(2, "0");
            const mm = String(selectedTime.getMinutes()).padStart(2, "0");
            setFormData(prev => ({ ...prev, time: `${hh}:${mm}` }));
        }
    };

    const selectedOccurrenceData = React.useMemo(() => {
        if (!selectedOccurrenceId || !detailData?.occurrences) return null;

        return detailData.occurrences.find(
            (occ: EventOccurrence) => occ.id === selectedOccurrenceId
        );
    }, [selectedOccurrenceId, detailData]);


    const effectiveDate = React.useMemo(() => {
        if (!detailData) return "";

        if (selectedOccurrenceData) {
            return selectedOccurrenceData.date;
        }

        return detailData.eventDate;
    }, [detailData, selectedOccurrenceData ]);

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };

    const handleUpdateAgenda = () => {
        if (!validateForm()) {
            setShowAgendaModal(false);
            return;
        }

        const eventDate = buildISODate();

        updateAgendaMutation.mutate(
            {
                id: idParam,
                eventData: {
                    title: formData.title,
                    eventDate,
                    projectId: formData.projectId,
                    frequency: isRecurring ? formData.frequency : null,
                },
            },
            {
                onSuccess: () => {
                    setShowAgendaModal(false);

                    setNotification({
                        visible: true,
                        status: "success",
                        title: "Agenda Berhasil Diubah",
                        description: "Agenda telah diubah, kembali ke daftar agenda.",
                    });
                },
                onError: (err: any) => {
                    setShowAgendaModal(false);

                    setNotification({
                        visible: true,
                        status: "error",
                        title: "Pembaharuan Gagal",
                        description:
                        err?.message || "Terjadi kesalahan saat mengirim pembaharuan.",
                    });
                },
            }
        );
    }

    const handleUpdateOccurrence = () => {
        if (!occurrenceId) {
            setNotification({
                visible: true,
                status: "error",
                title: "Occurrence belum dipilih",
                description: "Silakan pilih occurrence terlebih dahulu.",
            });
            return;
        }

        const eventDate = buildISODate();

        updateOccurrenceMutation.mutate(
            {
                id: occurrenceId,
                occurrencesData: {
                    date: eventDate,
                    isCancelled: false,
                },
            },
            {
                onSuccess: () => {
                    setShowOccurencesModal(false);
                    refetch();

                    setNotification({
                        visible: true,
                        status: "success",
                        title: "Occurrence Berhasil Diubah",
                        description: "Satu agenda berulang berhasil diperbarui.",
                    });
                },
                onError: (err: any) => {
                    setShowOccurencesModal(false);
                    setNotification({
                        visible: true,
                        status: "error",
                        title: "Update Gagal",
                        description: err?.message || "Terjadi kesalahan.",
                    });
                },
            }
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!detailData || !effectiveDate) return;

        const d = new Date(effectiveDate);

        const localDate = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes()
        );

        setFormData({
            title: detailData.title ?? "",
            date: localDate.toISOString().split("T")[0],
            time: localDate.toTimeString().slice(0, 5),
            projectId: detailData.projectId ?? null,
            frequency: detailData.frequency ?? null,
        });

        setSelectedOccurrence(detailData.frequency ?? null);
        setIsOccurent(!!detailData.frequency);

        if (detailData.project) {
            setSelectedProject(detailData.project);
        }
    }, [detailData, effectiveDate]);



    if (isLoading || showSkeleton || isDetailLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                <View style={gajiDetailStyles.header}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <SkeletonBox width={40} height={40} borderRadius={20} />
                        <SkeletonBox width={80} height={16} style={{ marginLeft: 12 }} />
                    </View>
                </View>
                <View style={[reimburseStyles.subHeaderContainer, {alignItems: "center"}]}>
                    <View style={{ gap: 5 }}>
                        <SkeletonBox width={90} height={20} borderRadius={20} />
                        <SkeletonBox width={120} height={20} borderRadius={20} />
                    </View>
                    <SkeletonBox width={60} height={60} borderRadius={30} />
                </View>

                <View style={{ width: "100%", gap: 5 }}>
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                alignItems: "center",
                                marginBottom: 20,
                                paddingHorizontal: 20,
                                backgroundColor: "transparent",
                            }}
                        >
                            <View style={{ width: "100%", gap: 10 }}>
                                <SkeletonBox width={60} height={20} borderRadius={24} />
                                <SkeletonBox width={80} height={40} style={{ width: "100%" }} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={reimburseStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => setShowBackModal(true)}
                >
                    <View style={reimburseStyles.iconPlace}>
                        <Image
                            style={reimburseStyles.iconBack}
                            source={require("../../../../assets/icons/arrow-left.png")}
                        />
                    </View>
                    <Text style={reimburseStyles.headerTitle}>Kembali</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: COLORS.background }}
                contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 20
                }}
                enableOnAndroid={true}
                extraScrollHeight={150}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetchingEvent || isFetchingProject}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                        progressViewOffset={HEADER_HEIGHT}
                    />
                }
            >
                <View style={reimburseStyles.subHeaderContainer}>
                    <View>
                        <Text style={reimburseStyles.subHeaderTitle}>
                            Update Event
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Update jadwal untuk tim kamu
                        </Text>
                    </View>
                    <View style={reimburseStyles.logoSubHeaderContainer}>
                        <Image
                            style={reimburseStyles.logoSubHeader}
                            source={require("../../../../assets/icons/calendar.png")}
                        />
                    </View>
                </View>
                <View style={{ width: "90%", gap: 5 }}>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Judul agenda <Text style={reimburseStyles.error}>*</Text></Text>
                        <TextInput
                            style={cutiDetailStyles.input}
                            placeholder="e.g. Team Meeting"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text})}
                        />
                        {error.title && <Text style={cutiDetailStyles.error}>{error.title}</Text>}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Tanggal agenda <Text style={reimburseStyles.error}>*</Text></Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text style={{ color: formData.date ? COLORS.textPrimary : COLORS.muted }}>
                                {formData.date || "Pilih tanggal agenda"}
                            </Text>
                        </TouchableOpacity>
                        {error.date && <Text style={cutiDetailStyles.error}>{error.date}</Text>}

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.date ? new Date(formData.date) : new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                minimumDate={new Date()}
                                onChange={onDateChange}
                            />
                        )}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Jam agenda <Text style={reimburseStyles.error}>*</Text></Text>
                        <TouchableOpacity
                            onPress={() => setShowStartPicker(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text style={{ color: formData.time ? COLORS.textPrimary : COLORS.muted }}>
                                {formData.time || "Pilih tanggal mulai"}
                            </Text>
                        </TouchableOpacity>
                        {error.time && <Text style={cutiDetailStyles.error}>{error.time}</Text>}

                        {showStartPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                minimumDate={new Date()}
                                onChange={onTimeChange}
                            />
                        )}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>
                            Ditujukan Kepada {isProjectRequired() && <Text style={reimburseStyles.error}>*</Text>}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text>
                                {selectedProject ? selectedProject.name : "Pilih Project"}
                            </Text>
                        </TouchableOpacity>
                        {error.projectId && (<Text style={cutiDetailStyles.error}>{error.projectId}</Text>)}
                    </View>
                    <SearchDropdownComponent<ProjectResponse>
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        items={availableTargets}
                        selected={selectedProject}
                        onChange={(project) => {
                            setSelectedProject(project);
                            setFormData(prev => ({
                                ...prev,
                                projectId: project?.id ?? null
                            }));
                        }}
                        getId={(p) => p.id}
                        getLabel={(p) => p.name}
                        title="Select Project"
                        placeholder="Cari project..."
                    />
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>
                            Apakah agenda Berulang?
                        </Text>
                        <TouchableOpacity
                            onPress={() => setModalOccurenceVisible(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text>
                                {selectedOccurrence ? selectedOccurrence : "Pilih Frekuensi"}
                            </Text>
                        </TouchableOpacity>
                        {error.projectId && (<Text style={cutiDetailStyles.error}>{error.projectId}</Text>)}
                    </View>
                    <SearchDropdownComponent<EventFreq>
                        visible={modalOccurenceVisible}
                        onClose={() => setModalOccurenceVisible(false)}
                        items={freqOptions}
                        selected={selectedOccurrence}
                        onChange={(freq) => {
                            setSelectedOccurrence(freq);
                            setIsOccurent(!!freq);
                            setFormData(prev => ({
                                ...prev,
                                frequency: freq
                            }));
                        }}
                        getId={(f) => f}
                        getLabel={(f) => {
                            if (f === EventFreq.DAILY) return "Harian";
                            if (f === EventFreq.WEEKLY) return "Mingguan";
                            if (f === EventFreq.MONTHLY) return "Bulanan";
                            return f;
                        }}
                        title="Pilih Perulangan"
                        placeholder="Cari frekuensi..."
                    />
                    {isRecurring ? (
                        <>
                            <TouchableOpacity
                                onPress={() => setShowOccurencesModal(true)}
                                style={cutiDetailStyles.submitButton}
                            >
                                <Text style={cutiDetailStyles.submitText}>
                                    Perbarui Agenda Ini Saja
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setShowAgendaModal(true)}
                                style={[cutiDetailStyles.submitButton, { backgroundColor: COLORS.white, borderColor: COLORS.primary, borderWidth: 1 }]}
                            >
                                <Text style={[cutiDetailStyles.submitText, { color: COLORS.primary}]}>
                                    Perbarui Agenda Berulang
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setShowAgendaModal(true)}
                            style={cutiDetailStyles.submitButton}
                        >
                            <Text style={cutiDetailStyles.submitText}>
                                Perbarui Agenda Berulang
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAwareScrollView>
            <BuatCalendarModalComponent
                visible={showAgendaModal}
                onClose={() => setShowAgendaModal(false)}
                onSave={handleUpdateAgenda}
                title={"Update Agenda"}
                description={"Apakah anda sudah yakin terhadap pembaharuan saat ini?"}
                textActive={"Ya, Simpan"}
                textPassive={"Batal"}
            />
            <BuatCalendarModalComponent
                visible={showOccurencesModal}
                onClose={() => setShowOccurencesModal(false)}
                onSave={handleUpdateOccurrence}
                title={"Update Agenda Berulang"}
                description={"Apakah anda sudah yakin terhadap pembaharuan saat ini?"}
                textActive={"Ya, Simpan"}
                textPassive={"Batal"}
            />
            <BuatCalendarModalComponent 
                visible={showBackModal}
                onClose={() => setShowBackModal(false)}
                onSave={() => {
                    setShowBackModal(false);
                    router.back();
                }}
                title={"Kembali ke page sebelumnya"}
                description={"Apakah anda ingin kembali sebelum melakukan submit?"}
                textActive={"Ya, Kembali"}
                textPassive={"Batal"}
            />

            <NotificationModal
                visible={notification.visible}
                status={notification.status}
                title={notification.title}
                description={notification.description}
                onContinue={() => {
                    setNotification(prev => ({ ...prev, visible: false }));

                    if (notification.status === "success") {
                        router.back();
                    }
                }}
            />
        </View>
    );
}

export default UpdateEventFormPage;