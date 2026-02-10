import { profileStyles } from "@/assets/styles/rootstyles/profiles/profile.styles"
import ListDataComponent from "@/components/rootComponents/profileComponent/ListDataComponent";
import COLORS from "@/constants/colors";
import { dummyUsers } from "@/data/dummyUser";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Modal, Animated, Easing, RefreshControl, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import ChangeImageModal from "@/components/rootComponents/profileComponent/ChangeImageModal";
import { useAuth } from "@/lib/api/hooks/useAuth";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchImageWithAuth, getImageUrl } from "@/lib/utils/path";
import { useUser } from "@/lib/api/hooks/useUser";
import { buildPhotoPart } from "@/lib/utils/getMimeFormURi";
import { getTokens, removeTokens } from "@/lib/utils/secureStorage";
import { router } from "expo-router";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { useKontrak } from "@/lib/api/hooks/useKontrak";
import { gajiDetailStyles } from "@/assets/styles/rootstyles/gaji/gajidetail.styles";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ProfilePage = () => {
    const { logoutAction } = useAuth();
    const user = useAuthStore((state) => state.user);
    const { data, isLoading, error: isKontrakError, refetch, isFetching } = useKontrak().fetchKontrakById(user?.id);
    
    const [itemPick, setItemPick] = useState("Business");
    const [openUserData, setOpenUserData] = useState(false);
    const [openKontrakData, setOpenKontrakData] = useState(false);
    const rotateUserAnim = useState(new Animated.Value(0))[0];
    const rotateKontrakAnim = useState(new Animated.Value(0))[0];

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const [showSkeleton, setShowSkeleton] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);

        await refetch();

        setTimeout(() => {
            setShowSkeleton(false);
            setRefreshing(false);
        }, 1000);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const loadPhoto = async (path?: string) => {
        const photoPath = path || user?.photo?.path;
        if (!photoPath) return;
        try {
            const blob = await fetchImageWithAuth(photoPath);
            const reader = new FileReader();
            reader.onload = () => setPhotoUri(reader.result as string);
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Load photo error:", err);
            setPhotoUri(null);
        }
    };

    useEffect(() => {
        loadPhoto();
    }, [user?.photo?.path]);

    const { mutate: updatePhoto, isPending: isUploading } = useUser().updatePhoto((data) => {
        loadPhoto(data.photo?.path);
    });

    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && user?.id) {
            const photoPart = buildPhotoPart(result.assets[0]);
            updatePhoto({ id: user.id, photo: photoPart });
            setIsModalVisible(false);
        }
    };

    const takeSelfie = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log("result", result);

        if (!result.canceled && user?.id) {
            const photoPart = buildPhotoPart(result.assets[0]);
            updatePhoto({ id: user.id, photo: photoPart });
            setIsModalVisible(false);
        }
    };
    
    const handleDownloadFile = async (doc: any) => {
        const token = await getTokens();
        const jwt = token?.access_token;

        const fileUrl = `${process.env.EXPO_PUBLIC_API_URL}/files?path=${doc.path}`;

        const fileUri =
            FileSystem.documentDirectory + doc.originalname;

        const download = FileSystem.createDownloadResumable(
            fileUrl,
            fileUri,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        const result = await download.downloadAsync();
        if (result?.uri) {
            await Sharing.shareAsync(result.uri);
        }
    };

    useEffect(() => {
        Animated.timing(rotateUserAnim, {
            toValue: openUserData ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [openUserData]);

    useEffect(() => {
        Animated.timing(rotateKontrakAnim, {
            toValue: openKontrakData ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [openKontrakData]);

    const rotateUserDeg = rotateUserAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "90deg"],
    });

    const rotateKontrakDeg = rotateKontrakAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "90deg"],
    });

    const handleLogout = async () => {
        logoutAction();
    };

    console.log("Kontrak Data", data);

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>
                    Memuat data user...
                </Text>
            </View>
        );
    }

    if (isLoading || showSkeleton) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                <View style={profileStyles.container}>
                    <View style={[profileStyles.cardProfile, { minHeight: SCREEN_HEIGHT - 150 }]}>
                        <View style={profileStyles.outerProfilePicture} />
                        <View style={profileStyles.profilePictureContainer}>
                            <SkeletonBox width={120} height={120} borderRadius={60} />
                        </View>
                        <View style={profileStyles.changeImageContainer}>
                            <SkeletonBox width={140} height={40} borderRadius={15} />
                        </View>
                        <View style={[profileStyles.namaUserContainer, { gap: 4 }]}>
                            <SkeletonBox width={120} height={20} borderRadius={4} />
                            <SkeletonBox width={150} height={20} borderRadius={4} />
                        </View>
                        <View style={profileStyles.menuPickerContainer}>
                            <View style={{ width: '100%', paddingVertical: 10 ,gap: 20 }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                        <SkeletonBox width={40} height={40} borderRadius={10} style={{ width: "100%" }} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            bounces={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || isFetching}
                    onRefresh={onRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                />
            }
        >
            <View style={profileStyles.container}>
                <View style={[profileStyles.cardProfile, { minHeight: SCREEN_HEIGHT - 150, paddingBottom: 120 }]}>
                    <View style={profileStyles.outerProfilePicture} />
                    <View style={profileStyles.profilePictureContainer}>
                        <Image
                            source={photoUri ? { uri: photoUri } : require("../../../assets/images/default-profile.png")}
                            style={profileStyles.profilePicture}
                        />
                    </View>
                    <View style={profileStyles.changeImageContainer}>
                        <TouchableOpacity 
                            style={profileStyles.changeImage}
                            onPress={() => setIsModalVisible(true)}
                        >
                            <Image
                                source={require("../../../assets/icons/changeImage.png")}
                                style={profileStyles.icons}
                            />
                            <Text style={profileStyles.textChangeImage}>
                                {isUploading ? "Uploading..." : "Change Profile"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={profileStyles.namaUserContainer}>
                        <View style={profileStyles.rowContainer}>
                            <Text style={profileStyles.namaUser}>{user.name}</Text>
                        </View>
                        <Text style={profileStyles.roleText}>{user.majorRole} - {user.minorRole}</Text>
                    </View>
                    <View style={profileStyles.menuPickerContainer}>
                        <TouchableOpacity
                            style={profileStyles.menuPicker}
                            onPress={() => setOpenUserData(!openUserData)}
                        >
                            <View style={profileStyles.menu}>
                                <Image
                                    source={require("../../../assets/icons/user.png")}
                                    style={profileStyles.imagePicker}
                                />
                                <Text style={profileStyles.textPicker}>Lihat Profil Saya</Text>
                            </View>
                            <Animated.Image 
                                source={require("../../../assets/icons/arrow-right.png")}
                                style={[profileStyles.actionImagePicker, { transform: [{ rotate: rotateUserDeg }] }]}
                            />
                        </TouchableOpacity>
                        {openUserData && (
                            <>
                                <View style={profileStyles.cardPickerContainer}>
                                    <TouchableOpacity 
                                        style={[
                                            profileStyles.buttonPicker,
                                            itemPick === "Business" && { backgroundColor: COLORS.primary },
                                        ]}
                                        onPress={() => setItemPick("Business")}
                                    >
                                        <Text
                                            style={[
                                                profileStyles.modeText,
                                                itemPick === "Business" && { color: COLORS.white },
                                            ]}
                                        >
                                            Business
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {itemPick === "Business" && (
                                    <ListDataComponent data={user} />
                                )}
                            </>
                        )}
                        <TouchableOpacity
                            style={profileStyles.menuPicker}
                            onPress={() => setOpenKontrakData(!openKontrakData)}
                        >
                            <View style={profileStyles.menu}>
                                <Image
                                    source={require("../../../assets/icons/document.png")}
                                    style={profileStyles.imagePicker}
                                />
                                <Text style={profileStyles.textPicker}>Lihat Kontrak Saya</Text>
                            </View>
                            <Animated.Image 
                                source={require("../../../assets/icons/arrow-right.png")}
                                style={[profileStyles.actionImagePicker, { transform: [{ rotate: rotateKontrakDeg }] }]}
                            />
                        </TouchableOpacity>
                        {openKontrakData && (
                                <View style={[gajiDetailStyles.itemContainer, {marginTop: 10}]}>
                                    <View style={gajiDetailStyles.labelContainer}>
                                        {data?.length > 0 ? (
                                            data.map((kontrak: any, kontrakIndex: number) => (
                                                <View key={kontrak.id || kontrakIndex}>
                                                    {data.length > 0 && (
                                                        <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 8 }}>
                                                            Kontrak {kontrak.jenis} ({kontrak.status})
                                                        </Text>
                                                    )}

                                                    {kontrak.documents?.length > 0 ? (
                                                        kontrak.documents.map((doc: any, docIndex: number) => (
                                                            <View
                                                                key={`${kontrakIndex}-${docIndex}`}
                                                                style={{
                                                                    backgroundColor: COLORS.white,
                                                                    flexDirection: "row",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                <View style={{
                                                                    width: 50,
                                                                    height: 50,
                                                                    borderRadius: 10,
                                                                    backgroundColor: "#E8EAF6",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    marginRight: 10,
                                                                }}>
                                                                    <Image
                                                                        source={require("../../../assets/icons/pdfFile.png")}
                                                                        style={{ width: 35, height: 35 }}
                                                                    />
                                                                </View>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text numberOfLines={1} style={{ fontWeight: "600", color: "#333", fontSize: 14 }}>
                                                                        {doc.originalname}
                                                                    </Text>
                                                                    <Text style={{ fontSize: 11, color: "#777" }}>
                                                                        {(doc.size / 1024).toFixed(1)} KB • PDF
                                                                    </Text>
                                                                </View>
                                                                <TouchableOpacity
                                                                    style={{
                                                                        backgroundColor: COLORS.primary,
                                                                        borderRadius: 20,
                                                                        width: 36,
                                                                        height: 36,
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                    }}
                                                                    onPress={() => handleDownloadFile(doc)}
                                                                >
                                                                    <Image
                                                                        source={require("../../../assets/icons/download.png")}
                                                                        style={{ width: 18, height: 18, tintColor: COLORS.white }}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ))
                                                    ) : (
                                                        <Text style={{ fontSize: 13, color: "#888", fontStyle: 'italic' }}>
                                                            Tidak ada dokumen untuk kontrak ini.
                                                        </Text>
                                                    )}
                                                </View>
                                            ))
                                        ) : (
                                            <Text style={{ marginTop: 6, fontSize: 13, color: "#888", textAlign: 'center' }}>
                                                Data kontrak tidak ditemukan.
                                            </Text>
                                        )}
                                    </View>
                                </View>
                        )}
                        <TouchableOpacity
                            style={profileStyles.menuPicker}
                            onPress={() => router.push("/(profile)/change-password")}
                        >
                            <View style={profileStyles.menu}>
                                <Image
                                    source={require("../../../assets/icons/forgot-password.png")}
                                    style={profileStyles.imagePicker}
                                />
                                <Text style={profileStyles.textPicker}>Ubah Password</Text>
                            </View>
                            <Image 
                                source={require("../../../assets/icons/arrow-right.png")}
                                style={profileStyles.actionImagePicker}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[profileStyles.menuPicker, { borderBottomWidth: 0}]}
                            onPress={() => handleLogout()}
                        >
                            <View style={profileStyles.menu}>
                                <Image
                                    source={require("../../../assets/icons/logout.png")}
                                    style={[profileStyles.imagePicker, {tintColor: COLORS.primary}]}
                                />
                                <Text style={[profileStyles.textPicker, {color: COLORS.primary}]}>Logout</Text>
                            </View>
                            <Image 
                                source={require("../../../assets/icons/arrow-right.png")}
                                style={[profileStyles.actionImagePicker, {tintColor: COLORS.primary}]}
                            />
                        </TouchableOpacity>                        
                    </View>
                </View>
            </View>
            <ChangeImageModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onTakeSelfie={takeSelfie}
                onPickGallery={pickImageFromGallery}
            />
        </KeyboardAwareScrollView>
    )
}

export default ProfilePage