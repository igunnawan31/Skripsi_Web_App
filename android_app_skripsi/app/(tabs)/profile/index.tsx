import { profileStyles } from "@/assets/styles/rootstyles/profiles/profile.styles"
import ListDataComponent from "@/components/rootComponents/profileComponent/ListDataComponent";
import COLORS from "@/constants/colors";
import { dummyUsers } from "@/data/dummyUser";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Modal, Animated, Easing } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import ChangeImageModal from "@/components/rootComponents/profileComponent/ChangeImageModal";
import { useAuth } from "@/lib/api/hooks/useAuth";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchImageWithAuth, getImageUrl } from "@/lib/utils/path";
import { useUser } from "@/lib/api/hooks/useUser";
import { buildPhotoPart } from "@/lib/utils/getMimeFormURi";
import { removeTokens } from "@/lib/utils/secureStorage";
import { router } from "expo-router";

const ProfilePage = () => {
    const { logoutAction } = useAuth();
    const user = useAuthStore((state) => state.user);
    const [itemPick, setItemPick] = useState("Business");
    const [openUserData, setOpenUserData] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

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

    const rotateAnim = useState(new Animated.Value(0))[0];
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: openUserData ? 1 : 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [openUserData]);

    const rotateDeg = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "90deg"],
    });

    const handleLogout = async () => {
        logoutAction();
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
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            contentContainerStyle={{
                paddingBottom: 240
            }}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            <View style={profileStyles.container}>
                <View 
                    style={[
                        profileStyles.cardProfile,
                        openUserData === false ? {height: "60%"} : {height: "82.75%"}
                    ]}
                >
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
                                    source={require("../../../assets/icons/add.png")}
                                    style={profileStyles.imagePicker}
                                />
                                <Text style={profileStyles.textPicker}>Lihat Profil Saya</Text>
                            </View>
                            <Animated.Image 
                                source={require("../../../assets/icons/arrow-right.png")}
                                style={[profileStyles.actionImagePicker, { transform: [{ rotate: rotateDeg }] }]}
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
                            onPress={() => setOpenUserData(!openUserData)}
                        >
                            <View style={profileStyles.menu}>
                                <Image
                                    source={require("../../../assets/icons/add.png")}
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
                            style={profileStyles.menuPicker}
                            onPress={(handleLogout)}
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