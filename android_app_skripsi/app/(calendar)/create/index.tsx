import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform, RefreshControl } from "react-native";
import COLORS from "@/constants/colors";
import SearchDropdownComponent from "@/components/rootComponents/calendarComponent/SearchDropdownComponent";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import BuatCalendarModalComponent from "@/components/rootComponents/calendarComponent/BuatCalendarModalComponent";
import { CreateEventRequest, EventFreq, FormDataEvent } from "@/types/event/eventTypes";
import { useEvent } from "@/lib/api/hooks/useEvent";
import { ProjectResponse, ProjectTeams } from "@/types/project/projectTypes";
import { useAuthStore } from "@/lib/store/authStore";
import { useProject } from "@/lib/api/hooks/useProject";
import { MajorRole, MinorRole } from "@/types/enumTypes";
import NotificationModal from "@/components/rootComponents/NotificationModal";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { gajiDetailStyles, HEADER_HEIGHT } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";

const CreateEventFormPage = () => {
    const user = useAuthStore((state) => state.user);
    const [showSubmitModal, setShowSubmitModal] = useState(false); 
    const [showBackModal, setShowBackModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const { data: projectResponse, isLoading, error: errorProject, isFetching } = useProject().fetchAllProject();
    const { mutate: eventData, isPending: isCreateCuti, isError} = useEvent().createEvents();
    const [isOccurent, setIsOccurent] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const router = useRouter();
    
    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
    const [selectedOccurrence, setSelectedOccurrence] = useState<EventFreq | null>(null);
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

        if (!formData.title.trim()) tempErrors.title = "Judul acara wajib diisi.";
        if (!formData.date) tempErrors.date = "Tanggal acara wajib diisi.";
        if (!formData.time) tempErrors.time = "Waktu acara wajib diisi.";

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

    const handleCreateEvent = () => {
        if (!validateForm()) {
            setShowSubmitModal(false);
            return;
        }

        const eventDate = buildISODate();
        const payload: CreateEventRequest = {
            title: formData.title,
            eventDate,
            projectId: formData.projectId,
            frequency: isOccurent ? formData.frequency : null,
        };

        eventData(payload, {
            onSuccess: () => {
                setShowSubmitModal(false);

                setNotification({
                    visible: true,
                    status: "success",
                    title: "Agenda Berhasil Dibuat",
                    description: "Agenda baru berhasil dibuat.",
                });
            },
            onError: (err: any) => {
                setShowSubmitModal(false);

                setNotification({
                    visible: true,
                    status: "error",
                    title: "Pengajuan Gagal",
                    description:
                    err?.message || "Terjadi kesalahan saat mengirim pengajuan reimburse.",
                });
            },
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading || showSkeleton) {
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
                    onPress={() => router.back()}
                >
                    <View style={reimburseStyles.iconPlace}>
                        <Image
                            style={reimburseStyles.iconBack}
                            source={require("../../../assets/icons/arrow-left.png")}
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
                        refreshing={refreshing || isFetching}
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
                            Buat Event
                        </Text>
                        <Text style={reimburseStyles.subHeaderDescription}>
                            Buat jadwal untuk tim kamu
                        </Text>
                    </View>
                    <View style={reimburseStyles.logoSubHeaderContainer}>
                        <Image
                            style={reimburseStyles.logoSubHeader}
                            source={require("../../../assets/icons/calendar.png")}
                        />
                    </View>
                </View>
                <View style={{ width: "90%", gap: 5 }}>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Judul Acara <Text style={reimburseStyles.error}>*</Text></Text>
                        <TextInput
                            style={cutiDetailStyles.input}
                            placeholder="e.g. Team Meeting"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text})}
                        />
                        {error.title && <Text style={cutiDetailStyles.error}>{error.title}</Text>}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Tanggal Acara <Text style={reimburseStyles.error}>*</Text></Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text style={{ color: formData.date ? COLORS.textPrimary : COLORS.muted }}>
                                {formData.date || "Pilih tanggal acara"}
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
                        <Text style={cutiDetailStyles.labelInput}>Jam Acara <Text style={reimburseStyles.error}>*</Text></Text>
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
                            Apakah Acara Berulang?
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
                    <TouchableOpacity
                        onPress={() => setShowSubmitModal(true)}
                        style={cutiDetailStyles.submitButton}
                    >
                        <Text style={cutiDetailStyles.submitText}>
                            Create Event
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            <BuatCalendarModalComponent
                visible={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onSave={handleCreateEvent}
                title={"Submit Indikator Kinerja Karyawan"}
                description={"Apakah anda sudah yakin terhadap indikator kinerja karyawan ini?"}
                textActive={"Ya, Simpan"}
                textPassive={"Batal"}
            />
            {/* <BuatCalendarModalComponent 
                visible={showBackModal}
                onClose={() => setShowBackModal(false)}
                onSave={() => {
                    setShowBackModal(false);
                    router.push("/(tabs)/calendar");
                }}
                title={"Kembali ke page sebelumnya"}
                description={"Apakah anda ingin kembali sebelum melakukan submit?"}
                textActive={"Ya, Kembali"}
                textPassive={"Batal"}
            /> */}

            <NotificationModal
                visible={notification.visible}
                status={notification.status}
                title={notification.title}
                description={notification.description}
                onContinue={() => {
                    setNotification(prev => ({ ...prev, visible: false }));

                    if (notification.status === "success") {
                        router.push("/(tabs)/calendar");
                    }
                }}
            />
        </View>
    );
}

export default CreateEventFormPage;