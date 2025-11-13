import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Image } from "react-native";
import { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { router, useRouter } from "expo-router";
import MapView from "react-native-maps";
import COLORS from "@/constants/colors";
import absenStyles from "@/assets/styles/rootstyles/absen/absen.style";
import AbsenPopModal from "@/components/rootComponents/absenComponent/AbsenPopUpModal";
import { useAbsen } from "@/context/AbsenContext";

const GeoLocationPage = () => {
    const {location, setLocationData} = useAbsen();
    const [region, setRegion] = useState<Region | null>(null);
    const [address, setAddress] = useState<string>("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showBackModal, setShowBackModal] = useState(false);

    const fetchLocation = useCallback(async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
        
            if ( status !== "granted" ) {
                setErrorMessage("Izin lokasi ditolak. Harap aktifkan GPS dan coba lagi.");
                setShowErrorModal(true);
                return;
            }

            let { coords } = await Location.getCurrentPositionAsync({ 
                accuracy: Location.Accuracy.Highest 
            });
            if ( coords ) {
                const { latitude, longitude } = coords;
                setLatitude(latitude);
                setLongitude(longitude);
                
                const regionData: Region = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                setRegion(regionData);

                const reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });

                if (reverseGeocode.length > 0) {
                    const addr = reverseGeocode[0];
                    setAddress(
                        `${addr.street}, ${addr.streetNumber}, ${addr.district || ""}, ${addr.city || ""}, ${addr.postalCode}`
                    );
                }
            }
        } catch (error) {
            setErrorMessage("Gagal Mendeteksi Lokasi, Pastikan GPS Anda Aktif");
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    const handleNext = () => {
        if (latitude !== null && longitude !== null) {
            setLocationData(latitude, longitude, address);
            console.log("Location saved: ", {latitude, longitude, address});
            return router.push('/(absensi)/fotoabsensi');
        } else {
            setErrorMessage("Lokasi belum terdeteksi sepenuhnya");
            setShowErrorModal(true);
        }
    };

    const handleRetry = () => {
        setShowErrorModal(false);
        fetchLocation();
    };

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

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
        router.back();
    };

    return (
        <View style={absenStyles.container}>
            <TouchableOpacity
                onPress={handleBackPress}
                style={absenStyles.iconPlace}
            >
                <Image
                    source={require("../../assets/icons/arrow-left.png")}
                    style={absenStyles.iconBack}
                />
            </TouchableOpacity>
            {loading ? (
                <View style={absenStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.tertiary} />
                    <Text style={{ marginTop: 8, color: COLORS.textPrimary }}>
                        Mendeteksi lokasi Anda...
                    </Text>
                </View>
            ) : (
                <>
                    <MapView style={absenStyles.map} region={region!} showsUserLocation>
                        {region && (
                            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
                                <View style={absenStyles.marker}>
                                    <Image 
                                        source={require("../../assets/icons/location.png")}
                                        style={{ width: 32, height: 32, tintColor:COLORS.tertiary }}
                                    />
                                </View>
                            </Marker>
                        )}
                    </MapView>

                    <View style={absenStyles.bottomCard}>
                        <Text style={absenStyles.label}>Lokasi Anda Saat Ini</Text>
                        <Text style={absenStyles.address}>{address}</Text>

                        <TouchableOpacity style={absenStyles.button} onPress={handleNext}>
                            <Text style={absenStyles.buttonText}>Lanjutkan</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            <AbsenPopModal
                title="Kembali ke Halaman Sebelumnya?"
                description="Data lokasi Anda belum tersimpan. Apakah Anda yakin ingin kembali?"
                activeButton="Batal"
                passiveButton="Kembali"
                visible={showBackModal}
                onActive={handleCloseBackModal}
                onPassive={handleConfirmBack}
            />

            <AbsenPopModal
                title="Gagal Mendeteksi Lokasi"
                description={errorMessage || "Silakan coba lagi atau periksa izin lokasi Anda."}
                activeButton="Coba Lagi"
                passiveButton="Kembali"
                visible={showErrorModal}
                onActive={handleRetry}
                onPassive={handleCloseErrorModal}
            />
        </View>
    )
}

export default GeoLocationPage;