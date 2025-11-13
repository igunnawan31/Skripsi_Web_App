import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { Camera, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useAbsen } from "@/context/AbsenContext";
import COLORS from "@/constants/colors";
import absenFotoStyles from "@/assets/styles/rootstyles/absen/absenfoto.style";
import AbsenPopModal from "@/components/rootComponents/absenComponent/AbsenPopUpModal";

const { width } = Dimensions.get("window");

const FotoAbsensiPage = () => {
    const [cameraType, setCameraType] = useState<CameraType>("front");
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [showBackModal, setShowBackModal] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const router = useRouter();
    const { setPhotoUrl: savePhotoToContext } = useAbsen();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={absenFotoStyles.container}>
            <Text style={absenFotoStyles.message}>Izin kamera diperlukan untuk melanjutkan.</Text>
            <TouchableOpacity onPress={requestPermission} style={absenFotoStyles.captureButton}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Beri Izin</Text>
            </TouchableOpacity>
            </View>
        );
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ quality: 1.0, base64: true });
            setPhotoUrl(photo.uri);
            savePhotoToContext(photo.uri);
            router.push("/(absensi)/summary");
        }
    };

    function toggleCameraFacing() {
        setCameraType(current => (current === 'front' ? 'back' : 'front'));
    }

    const handleBackPress = () => {
        setShowBackModal(true);
    };

    const handleConfirmBack = () => {
        setShowBackModal(false);
        router.back();
    };
    
    const handleCloseBackModal = () => {
        setShowBackModal(false);
    };

    return (
        <View style={absenFotoStyles.container}>
            <TouchableOpacity
                onPress={handleBackPress}
                style={absenFotoStyles.iconPlace}
            >
                <Image
                    source={require("../../assets/icons/arrow-left.png")}
                    style={absenFotoStyles.iconBack}
                />
            </TouchableOpacity>
            <View style={absenFotoStyles.header}>
                <Text style={absenFotoStyles.textHeader}>Ambil Foto Selfie</Text>
            </View>
            <CameraView
                ref={cameraRef}
                facing={cameraType}
                style={absenFotoStyles.camera}
            >
                <View style={absenFotoStyles.overlay}>
                    <View style={absenFotoStyles.faceFrame} />
                </View>
                <View style={absenFotoStyles.footer}>
                    <Text style={absenFotoStyles.instruction}>Pastikan wajah anda terlihat jelas</Text>

                    <View style={{ width: "100%", height: 90, marginTop: 10 }}>
                        <TouchableOpacity style={[absenFotoStyles.flipButton, absenFotoStyles.flipButtonPosition]} onPress={toggleCameraFacing}>
                        <Image source={require("../../assets/icons/flip-camera.png")} style={{ width: 28, height: 28, tintColor: COLORS.tertiary }} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[absenFotoStyles.captureButton, absenFotoStyles.centerButtonPosition]} onPress={takePicture}>
                        <Image source={require("../../assets/icons/camera.png")} style={{ width: 32, height: 32, tintColor: COLORS.white }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>

            <AbsenPopModal
                title="Kembali ke Halaman Sebelumnya?"
                description="Data foto Anda belum tersimpan. Apakah Anda yakin ingin kembali?"
                activeButton="Batal"
                passiveButton="Kembali"
                visible={showBackModal}
                onActive={handleCloseBackModal}
                onPassive={handleConfirmBack}
            />
        </View>
    );
};

export default FotoAbsensiPage;
