import { profileStyles } from "@/assets/styles/rootstyles/profiles/profile.styles"
import ListDataComponent from "@/components/rootComponents/profileComponent/ListDataComponent";
import COLORS from "@/constants/colors";
import { dummyUsers } from "@/data/dummyUser";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View, Modal } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import ChangeImageModal from "@/components/rootComponents/profileComponent/ChangeImageModal";
import { useAuth } from "@/lib/api/hooks/useAuth";
import { useAuthStore } from "@/lib/store/authStore";
import { getImageUrl } from "@/lib/utils/path";
import { useUser } from "@/lib/api/hooks/useUser";

const ProfilePage = () => {
    const { logoutAction } = useAuth();
    const user = useAuthStore((state) => state.user);
    const photoUrl = user?.photo ? getImageUrl(user.photo) : null;
    const [data, setData] = useState(dummyUsers);
    const [itemPick, setItemPick] = useState<"Personal" | "Business" | "Others">("Business");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState(require("../../../assets/images/foto2.jpeg"));
    const { mutate: updatePhoto, isPending: isUploading } = useUser().updatePhoto();
    console.log("user", user);

    const uriToFile = async (uri: string) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new File([blob], "profile.jpg", { type: "image/jpeg" });
    }

    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && user?.id) {
            const photoData = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName,
                type: result.assets[0].type,
            };
            updatePhoto({ id: user.id, photo: photoData });
            setProfileImage({ uri: result.assets[0].uri });
            setIsModalVisible(false);
        }
    };

    const takeSelfie = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && user?.id) {
            const photoData = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName,
                type: result.assets[0].type, 
            };
            updatePhoto({ id: user.id, photo: photoData });
            setProfileImage({ uri: result.assets[0].uri });
            setIsModalVisible(false);
        }
    };

    const onSubmit = () => {
        logoutAction();
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            enableOnAndroid={true}
            extraScrollHeight={80}
            keyboardShouldPersistTaps="handled"
        >
            <View style={profileStyles.container}>
                <View 
                    style={[
                        profileStyles.cardProfile,
                        {height: "75%"}
                    ]}
                >
                    <View style={profileStyles.outerProfilePicture} />
                    <View style={profileStyles.profilePictureContainer}>
                        <Image 
                            source={photoUrl ? { uri: photoUrl } : require("../../../assets/images/default-profile.png")} 
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
                            <Text style={profileStyles.textChangeImage}>Change Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={profileStyles.namaUserContainer}>
                        <View style={profileStyles.rowContainer}>
                            <Text style={profileStyles.namaUser}>Muhamad Gunawan</Text>
                            <View
                                style={[
                                    profileStyles.statusBadge,
                                ]}
                            >
                                <Text style={profileStyles.statusText}>WFO</Text>
                            </View>
                        </View>
                        <Text style={profileStyles.roleText}>Karyawan - Backend Developer</Text>
                    </View>
                    <View style={profileStyles.cardPickerContainer}>
                        {/* <TouchableOpacity 
                            style={[
                                profileStyles.buttonPicker,
                                itemPick === "Personal" && { backgroundColor: COLORS.primary },
                            ]}
                            onPress={() => setItemPick("Personal")}
                        >
                            <Text
                                style={[
                                    profileStyles.modeText,
                                    itemPick === "Personal" && { color: COLORS.white },
                                ]}
                            >
                                Personal
                            </Text>
                        </TouchableOpacity> */}
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
                        {/* <TouchableOpacity 
                            style={[
                                profileStyles.buttonPicker,
                                itemPick === "Others" && { backgroundColor: COLORS.primary },
                            ]}
                            onPress={() => setItemPick("Others")}
                        >
                            <Text
                                style={[
                                    profileStyles.modeText,
                                    itemPick === "Others" && { color: COLORS.white },
                                ]}
                            >
                                Others
                            </Text>
                        </TouchableOpacity> */}
                    </View>

                    {/* {itemPick === "Personal" && (
                        <ListDataComponent data={data[0].dataPersonal} />
                    )} */}
                    {itemPick === "Business" && (
                        <ListDataComponent data={data[0].dataBusiness} />
                    )}
                    {/* {itemPick === "Others" && (
                        <ListDataComponent data={data[0].dataOthers} />
                    )} */}
                    <TouchableOpacity 
                        style={[
                            profileStyles.buttonPicker
                        ]}
                        onPress={(onSubmit)}
                    >
                        <Text
                            style={[
                                profileStyles.modeText,
                                itemPick === "Others" && { color: COLORS.white },
                            ]}
                        >
                            Logout
                        </Text>
                    </TouchableOpacity>
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