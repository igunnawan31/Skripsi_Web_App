import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
} from "react-native";
import COLORS from "@/constants/colors";
import SearchDropdownComponent, { User } from "@/components/rootComponents/calendarComponent/SearchDropdownComponent";
import { dummyProjects } from "@/data/dummyProject";
import { dummyUsers, MajorRole, MinorRole } from "@/data/dummyUsers";
import { ProjectType } from "@/components/rootComponents/calendarComponent/SearchDropdownComponent";
import penilaianKpiStyles from "@/assets/styles/rootstyles/kpi/penilaiankpi.styles";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import reimburseStyles from "@/assets/styles/rootstyles/reimburse/reimburse.styles";
import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";
import { cutiDetailStyles } from "@/assets/styles/rootstyles/cuti/cutidetail.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import BuatCalendarModalComponent from "@/components/rootComponents/calendarComponent/BuatCalendarModalComponent";

type CalendarForm = {
    title: string;
    createdBy: User,
    eventFor: ProjectType[];
    tanggal: string;
    startTime: string;
    endTime: string;
}

const CreateEventFormPage = () => {
    const [title, setTitle] = useState("");
    const [startTime, setStart] = useState("");
    const [endTime, setEnd] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [showSubmitModal, setShowSubmitModal] = useState(false); 
    const [showBackModal, setShowBackModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [error, setError] = useState<{ [key: string]: string}>({});
    const router = useRouter();
    const [selectedProjects, setSelectedProjects] = useState<ProjectType[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const currentUser = dummyUsers[4];
    let availableTargets: ProjectType[] = [];

    if (
        currentUser.majorRole === MajorRole.OWNER ||
        currentUser.minorRole === MinorRole.HR
    ) {
        availableTargets = dummyProjects;
    } else if (currentUser.minorRole === MinorRole.PROJECT_MANAGER) {
        availableTargets = dummyProjects.filter(
            (p) => p.ketuaProject.userId === currentUser.userId
        );
    } else {
        availableTargets = dummyProjects.filter((p) =>
            p.anggotaProject.some((u) => u.userId === currentUser.userId)
        );
    };
    
    const [formData, setFormData] = useState<CalendarForm>({
        title: "",
        createdBy: dummyUsers[0],
        eventFor: [],
        tanggal: "",
        startTime: "",
        endTime: "",
    })

    const handleDateChange = (key: "tanggal", value: string) => {
        setFormData((prev) => {
            const updated = { ...prev, [key]: value };
            setError((prevErrors) => ({ ...prevErrors, [key]: "" }));
            return updated;
        });
    };
    const handleTimeChange = (
        key: "startTime" | "endTime",
        event: any,
        selectedDate: Date | undefined,
    ) => {
        if (event.type === "dismissed") {
            if (key === "startTime") setShowStartPicker(false);
            if (key === "endTime") setShowEndPicker(false);
            return;
        }

        if (!selectedDate) return;

        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        const formatted = `${hours}:${minutes}`;

        setFormData((prev) => {
            const updated = { ...prev, [key]: formatted };
            if (updated.startTime && updated.endTime) {
                const [sh, sm] = updated.startTime.split(":").map(Number);
                const [eh, em] = updated.endTime.split(":").map(Number);

                const startMinutes = sh * 60 + sm;
                const endMinutes = eh * 60 + em;

                if (endMinutes <= startMinutes) {
                    setError((e) => ({
                        ...e,
                        [key]: "End time must be later than start time"
                    }));
                    return prev;
                }
            }

            setError((e) => ({ ...e, [key]: "" }));
            return updated;
        });

        if (key === "startTime") setShowStartPicker(false);
        if (key === "endTime") setShowEndPicker(false);
    };

    const handleChange = (event: any, selectedDate: Date | undefined, key: "tanggal") => {
        if (event.type === "dismissed") {
            setShowDatePicker(false);
            return;
        }

        if (!selectedDate) return;

        const formatted = selectedDate.toISOString().split("T")[0];
        handleDateChange(key, formatted);

        setShowDatePicker(false);
    };

    const handleCreateEvent = () => {
        // if (!title || !tanggal || !startTime || !endTime) {
        //     alert("Semua field wajib diisi");
        //     return;
        // }
        // if (selectedProjects.length === 0) {
        //     alert("Pilih minimal satu project");
        //     return;
        // }
        const newEvent = {
            id: Date.now().toString(),
            title,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            createdBy: currentUser,
            eventFor: selectedProjects,
        };
        setShowSubmitModal(false);
        router.push("/(tabs)/calendar");
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
                            value={title}
                            onChangeText={setTitle}
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
                            <Text style={{ color: formData.tanggal ? COLORS.textPrimary : COLORS.muted }}>
                                {formData.tanggal || "Pilih tanggal mulai"}
                            </Text>
                        </TouchableOpacity>
                        {error.tanggal && <Text style={cutiDetailStyles.error}>{error.tanggal}</Text>}

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.tanggal ? new Date(formData.tanggal) : new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={(e, date) => handleChange(e, date, "tanggal")}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Jam Mulai</Text>
                        <TouchableOpacity
                            onPress={() => setShowStartPicker(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text style={{ color: formData.startTime ? COLORS.textPrimary : COLORS.muted }}>
                                {formData.startTime || "Pilih tanggal mulai"}
                            </Text>
                        </TouchableOpacity>
                        {error.startTime && <Text style={cutiDetailStyles.error}>{error.startTime}</Text>}

                        {showStartPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={(event, date) => handleTimeChange("startTime", event, date)}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>
                    <View style={cutiDetailStyles.labelContainer}>
                        <Text style={cutiDetailStyles.labelInput}>Jam Berakhir</Text>
                        <TouchableOpacity
                            onPress={() => setShowEndPicker(true)}
                            style={[cutiDetailStyles.input, { justifyContent: "center", paddingVertical: 12 }]}
                        >
                            <Text style={{ color: formData.endTime ? COLORS.textPrimary : COLORS.muted }}>
                                {formData.endTime || "Pilih tanggal selesai"}
                            </Text>
                        </TouchableOpacity>
                        {error.endTime && <Text style={cutiDetailStyles.error}>{error.endTime}</Text>}

                        {showEndPicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={(event, date) => handleTimeChange("endTime", event, date)}
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
                                    : selectedProjects.map((p) => p.projectName).join(", ")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <SearchDropdownComponent
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        items={availableTargets}
                        selected={selectedProjects}
                        onChange={setSelectedProjects}
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