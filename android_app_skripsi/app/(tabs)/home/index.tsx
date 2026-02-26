import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Svg, Path } from "react-native-svg";
import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import ModalNotification from "@/components/rootComponents/homeComponent/ModalNotification";
import AbsenseComponent from "@/components/rootComponents/homeComponent/AbsenseComponent";
import FeatureComponent from "@/components/rootComponents/homeComponent/FeatureComponent";
import ReimburseComponent from "@/components/rootComponents/homeComponent/ReimburseComponent";
import { useAuthStore } from "@/lib/store/authStore";
import { useAbsensi } from "@/lib/api/hooks/useAbsensi";
import { useReimburse } from "@/lib/api/hooks/useReimburse";
import COLORS from "@/constants/colors";
import SkeletonBox from "@/components/rootComponents/SkeletonBox";
import { useNotification } from "@/lib/api/hooks/useNotification";

const HomePage = () => {
    const [newNotification, setNewNotification] = useState(false);
    const [onClickNotification, setOnClickNotification] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const user = useAuthStore((state) => state?.user);
    const userId = user?.id ? user.id : null;

    const dateNow = useMemo(() => {
        const now = new Date();
        const utcPlus7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        return utcPlus7.toISOString();
    }, []);

    const { data: dataAbsensi, isLoading: isLoadingAbsensi, refetch: refetchAbs, isFetching: isFetchingAbs } = useAbsensi().fetchAbsensiById(userId, dateNow);
    const { data: dataReimburse, isLoading: isLoadingReimburse, refetch: refetchReim, isFetching: isFetchingReim } = useReimburse().fetchAllReimburse();
    const { data: dataNotif, isLoading: isLoadingNotif, refetch: refetchNotif, isFetching: isFetchingNotif } = useNotification().fetchAllNotification();    

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const date = now.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            const time = now.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            });
            setCurrentDate(date);
            setCurrentTime(time);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        setShowSkeleton(true);
        await refetchAbs();
        await refetchReim();
        await refetchNotif();
        setShowSkeleton(false);
        setRefreshing(false);
    };

    if (!user) {
        return (
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted }}>Data tidak ditemukan...</Text>
            </View>
        );
    }

    if (isLoadingAbsensi || isLoadingNotif || isLoadingReimburse || showSkeleton || isFetchingAbs || isFetchingReim || isFetchingNotif) {
        return (
            <View style={homeStyles.container}>
                <View style={homeStyles.header}>
                    <View style={{ gap: 4 }}>
                        <SkeletonBox width={80} height={16} />
                        <SkeletonBox width={160} height={16} />
                    </View>
                    <SkeletonBox width={40} height={40} borderRadius={20} />
                </View>

                <View style={{ 
                    position: "absolute",
                    top: 80,
                    width: "90%",
                    height: "auto",
                    justifyContent: "center",
                    paddingVertical: 16,
                    borderRadius: 10,
                    overflow: "hidden",
                }}>
                    <SkeletonBox width={200} height={200} borderRadius={14} style={{ width: "100%" }}  />
                </View>

                <View style={[homeStyles.featureContainer, { paddingHorizontal: 10 }]}>
                    <View style={{ gap: 4 }}>
                        <SkeletonBox width={80} height={16} />
                        <SkeletonBox width={160} height={16} />
                    </View>
                    <View style={{ flexDirection: "row", gap: 20, marginVertical: 16 }}>
                        {[1, 2, 3, 4].map((_, i) => (
                            <View
                                key={i}
                                style={{
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 10,
                                    backgroundColor: "transparent",
                                }}
                            >
                                <SkeletonBox width={70} height={70} borderRadius={10}/>
                                <SkeletonBox width={40} height={10} borderRadius={10}/>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={homeStyles.reimburseContainer}>
                    <View style={homeStyles.titleContainer}>
                        <View style={{ gap: 4 }}>
                            <SkeletonBox width={80} height={16} />
                            <SkeletonBox width={160} height={16} />
                        </View>
                        <SkeletonBox width={120} height={36} />
                    </View>
                    {[1, 2, 3, 4].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                marginBottom: 20,
                                backgroundColor: "transparent",
                            }}
                        >
                            <SkeletonBox width={100} height={140} borderRadius={10} style={{ width: "100%" }} />
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || isFetchingAbs || isFetchingReim}
                    onRefresh={onRefresh}
                    colors={[COLORS.primary]}
                    tintColor={COLORS.primary}
                />
            }
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
                        <Text style={homeStyles.headerTitle}>{user?.name ? user?.name : "Not Available"}</Text>
                        <Text style={homeStyles.headerDescription}>
                            {user?.minorRole ? user?.minorRole : "Not Available"}
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
                        data={dataNotif}
                        isVisible={onClickNotification}
                        onClose={() => setOnClickNotification(false)}
                    />
                </View>
                <AbsenseComponent 
                    data={dataAbsensi}
                    currentDate={currentDate}
                    currentTime={currentTime}
                />
                <FeatureComponent />
                <ReimburseComponent data={dataReimburse}/>
            </View>
        </ScrollView>
    );
};

export default HomePage;
