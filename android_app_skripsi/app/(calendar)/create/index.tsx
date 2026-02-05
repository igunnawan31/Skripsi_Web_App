import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import COLORS from "@/constants/colors";
import SearchDropdownComponent from "@/components/rootComponents/calendarComponent/SearchDropdownComponent";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import BuatCalendarModalComponent from "@/components/rootComponents/calendarComponent/BuatCalendarModalComponent";
import { CreateEventRequest, FormDataEvent } from "@/types/event/eventTypes";
import { useEvent } from "@/lib/api/hooks/useEvent";
import { ProjectResponse, ProjectTeams } from "@/types/project/projectTypes";
import { useAuthStore } from "@/lib/store/authStore";
import { useProject } from "@/lib/api/hooks/useProject";
import { MajorRole, MinorRole } from "@/types/enumTypes";

const CreateEventFormPage = () => {
    const user = useAuthStore((state) => state.user);
    const [showSubmitModal, setShowSubmitModal] = useState(false); 
    const [showBackModal, setShowBackModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const { data: projectResponse, isLoading, error: errorProject } = useProject().fetchAllProject();
    const { mutate: eventData, isPending: isCreateCuti, isError} = useEvent().createEvents();
    const [isOccurent, setIsOccurent] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const router = useRouter();
    const [selectedProjects, setSelectedProjects] = useState<ProjectResponse[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

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

        if (!data.date || !data.time) return "";

        return new Date(`${data.date}T${data.time}`).toISOString();
    };

    const projects = projectResponse?.data ?? [];
    const currentUser = user;
    console.log(user.id);
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
                p.projectTeams?.some((team: ProjectTeams) => team.userId === user.userId)
            );
        }
    }

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) tempErrors.title = "Judul acara wajib diisi.";
        if (!formData.date) tempErrors.date = "Tanggal acara wajib diisi.";
        if (!formData.time) tempErrors.time = "Waktu acara wajib diisi.";

        setError(tempErrors);       
        return Object.keys(tempErrors).length === 0;
    };

    const handleCreateEvent = () => {
        const eventDate = buildISODate();

        if (!validateForm()) {
            setShowSubmitModal(false);
        }

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
                    title: "Pengajuan Berhasil",
                    description: "Pengajuan reimburse anda berhasil dikirim.",
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
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={reimburseStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => setShowBackModal(true)}
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
                        <Text style={cutiDetailStyles.labelInput}>Judul Event</Text>
                        <TextInput
                            style={cutiDetailStyles.input}
                            placeholder="e.g. Team Meeting"
                        />
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Tanggal Event</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text style={{ color: formData.date ? COLORS.textPrimary : COLORS.muted }}>
                                {formData.date || "Pilih tanggal acara"}
                            </Text>
                        </TouchableOpacity>
                        {error.tanggal && <Text style={cutiDetailStyles.error}>{error.tanggal}</Text>}

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.date ? new Date(formData.date) : new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Jam Acara</Text>
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
                            />
                        )}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Ditujukan Kepada</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text>
                                {selectedProjects.length === 0
                                    ? "Select Project"
                                    : selectedProjects.map((p) => p.name).join(", ")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <SearchDropdownComponent
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        items={availableTargets}
                        selected={selectedProjects}
                        onChange={(projects) => {
                            setSelectedProjects(projects);
                            setFormData(prev => ({
                                ...prev,
                                projectId: projects.length ? projects[0].id : null
                            }));
                        }}
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
            <BuatCalendarModalComponent 
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
            />
        </View>
    );
}

export default CreateEventFormPage;