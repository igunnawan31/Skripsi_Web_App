import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Svg, Path } from "react-native-svg";
import { COLORS } from "@/constants/colors";
import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootTabParamList } from "@/components/rootComponents/Tabs";
import { dummyUsers } from "@/data/dummyUsers";
import ModalNotification from "@/components/rootComponents/homeComponent/modalNotification";
import AbsenseComponent from "@/components/rootComponents/homeComponent/AbsenseComponent";
import FeatureComponent from "@/components/rootComponents/homeComponent/FeatureComponent";

type HomeNavigation = NativeStackNavigationProp<RootTabParamList, "Home Page">;

const HomePage = () => {
    const navigation = useNavigation<HomeNavigation>();
    const [userData, setUserData] = useState(dummyUsers);
    const [newNotification, setNewNotification] = useState(false);
    const [onClickNotification, setOnClickNotification] = useState(false);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={homeStyles.container}>
                <View style={homeStyles.header}>
                    <Svg
                        height="180"
                        width="250"
                        viewBox="0 0 600 600"
                        style={homeStyles.headerBlob}
                    >
                        <Path
                            fill="#A5D8FF"
                            opacity="0.4"
                            d="M421.3,290.3Q423,340.6,390.3,382.5Q357.6,424.3,308.3,444.1Q259,464,213.2,434.1Q167.3,404.3,122.4,367.1Q77.4,330,88.5,275.8Q99.6,221.7,135.7,181.2Q171.9,140.7,220.9,125.4Q269.9,110,319.1,128.6Q368.3,147.3,400.6,193.6Q432.9,239.9,421.3,290.3Z"
                        />
                    </Svg>
                    <Svg
                        height="700"
                        width="1000"
                        viewBox="0 0 400 400"
                        style={homeStyles.headerBlob}
                    >
                        <Path 
                            fill="#A5D8FF"
                            opacity="0.4" 
                            d="M54.2,-67.6C69.8,-63.3,81.7,-46.9,80.2,-30.9C78.7,-15,63.9,0.5,53.8,13.2C43.8,26,38.6,36,30.5,42.4C22.3,48.8,11.1,51.6,-2.8,55.5C-16.8,59.3,-33.6,64.3,-42.2,58C-50.8,51.8,-51.3,34.3,-58.3,17.8C-65.3,1.2,-78.8,-14.4,-78.5,-28.6C-78.1,-42.7,-63.8,-55.4,-48.4,-59.7C-33,-64.1,-16.5,-60.1,1.4,-62C19.3,-64,38.6,-71.9,54.2,-67.6Z" 
                            transform="translate(100 100)" 
                        />   
                    </Svg>
                    <View>
                        <Text style={homeStyles.headerTitle}>{userData[0].dataPersonal[0].value}</Text>
                        <Text style={homeStyles.headerDescription}>
                            {userData[0].dataBusiness[2].value}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={homeStyles.logoHeaderContainer}
                        onPress={() => setOnClickNotification(true)}
                    >
                        <Image
                            style={homeStyles.logoHeader}
                            source={
                                newNotification
                                ? require("../../../assets/icons/notification-in.png")
                                : require("../../../assets/icons/notification.png")
                            }
                        />
                    </TouchableOpacity>
                    <ModalNotification
                        isVisible={onClickNotification}
                        onClose={() => setOnClickNotification(false)}
                    />
                </View>
                <AbsenseComponent />
                <FeatureComponent />
            </View>
        </ScrollView>
    );
};

export default HomePage;
