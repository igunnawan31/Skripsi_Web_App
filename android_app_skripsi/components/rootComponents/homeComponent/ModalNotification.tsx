import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { notificationStyles } from "@/assets/styles/rootstyles/home/notification.styles";
import { COLORS } from "@/constants/colors";
import { dummyNotifications } from "@/data/dummyNotifications";
import { useNotification } from "@/lib/api/hooks/useNotification";

type ModalNotificationProps = {
    data: any;
    isVisible: boolean;
    onClose: () => void;
};

const ModalNotification = ({ data, isVisible, onClose }: ModalNotificationProps) => {
    const [showAll, setShowAll] = useState(false);
    const notifications = data || [];
    const displayedData = showAll ? notifications : notifications.slice(0, 4);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.3}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            animationInTiming={350}
            animationOutTiming={350}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            style={{
                margin: 0,
                alignItems: "flex-end",
                justifyContent: "flex-start",
            }}
        >
            <View style={notificationStyles.container}>
                <View style={{ width: "100%" }}>
                    <View style={notificationStyles.titleNotificationContainer}>
                        <Text style={notificationStyles.headerTitle}>Notifikasi</Text>
                        { notifications.length > 4 &&
                            showAll && (
                                <TouchableOpacity
                                    onPress={() => setShowAll(false)}
                                    style={notificationStyles.showAllButton}
                                >
                                    <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                                        Lihat lebih sedikit
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    {notifications.length > 0 ? (
                        <ScrollView
                            style={{
                                maxHeight: showAll ? 450 : undefined,
                            }}
                            showsVerticalScrollIndicator={showAll}
                        >
                            {displayedData.map((item: any) => (
                                <View 
                                    key={item.id}
                                    style={notificationStyles.notificationBox}
                                >
                                    <View style={notificationStyles.rowDate}>
                                        <Text style={notificationStyles.date}>{item.tanggal}</Text>
                                    </View>
                                    <View style={notificationStyles.row}>
                                        <Text style={notificationStyles.title}>{item.title}</Text>
                                        <View style={notificationStyles.categoryBadge}>
                                            <Text style={notificationStyles.categoryText}>{item.category}</Text>
                                        </View>
                                    </View>
                                    <View style={notificationStyles.row}>
                                        <Text style={notificationStyles.content}>{item.content}</Text>
                                        <Text style={notificationStyles.time}>{item.time}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={{ textAlign: "center", marginTop: 20, color: COLORS.muted }}>
                            Belum ada Notifikasi
                        </Text>  
                    )}
                    { notifications.length > 4 &&
                        !showAll && (
                            <TouchableOpacity
                                style={[notificationStyles.showAllButton, { alignSelf: "center", marginTop: 20}]}
                                onPress={() => setShowAll(true)}
                            >
                                <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                                    Lihat lebih banyak
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
            <TouchableOpacity
                style={notificationStyles.logoHeaderContainer}
                onPress={onClose}
            >
                <Image
                    source={require("@/assets/icons/close.png")}
                    style={notificationStyles.logoHeader}
                />
            </TouchableOpacity>
        </Modal>
    );
};

export default ModalNotification;
