import { GajiStyles } from "@/assets/styles/rootstyles/gaji/gaji.styles";
import COLORS from "@/constants/colors";
import { dummyGaji } from "@/data/dummyGaji";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

const GajiPage = () => {
    const router = useRouter();
    const [data, setData] = useState(dummyGaji);
    const [showAll, setShowAll] = useState(false);
    const [showCurrency, setShowCurrency] = useState(true);
    const displayedData = showAll ? data : data.slice(0,5);
    const totalCurrency = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <View style={GajiStyles.container}>
            <View style={GajiStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={GajiStyles.iconPlace}>
                        <Image
                            style={GajiStyles.iconBack}
                            source={require('../../assets/icons/arrow-left.png')}
                        />
                    </View>
                    <Text style={GajiStyles.headerTitle}>
                        Kembali
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={GajiStyles.firstContainer}>
                <View style={GajiStyles.currencyInformation}>
                    <View style={GajiStyles.gapCurrency}>
                        <Image
                            source={require('../../assets/icons/rupiah.png')}
                            style={GajiStyles.icons}
                        />
                        <Text style={GajiStyles.textCurrency}>Jumlah</Text>
                    </View>
                    <View style={GajiStyles.gapCurrency}>
                        <Image
                            source={require('../../assets/icons/indonesia.png')}
                            style={GajiStyles.flag}
                        />
                        <Text style={GajiStyles.textCurrency}>IDR</Text>
                    </View>
                </View>
                <View style={GajiStyles.gapCurrency}>
                    <Text style={GajiStyles.currency}>
                        {showCurrency
                            ? totalCurrency.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR"
                            })
                            : "************"}
                    </Text>
                    {showCurrency ? (
                        <TouchableOpacity onPress={() => setShowCurrency(false)}>
                            <Image
                                source={require("../../assets/icons/eyes-close.png")}
                                style={{ width: 20, height: 20 }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setShowCurrency(true)}>
                            <Image
                                source={require("../../assets/icons/eyes-open.png")}
                                style={{ width: 20, height: 20 }}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={GajiStyles.secondContainer}>
                <View style={GajiStyles.recentEarning}>
                    <View style={GajiStyles.titleRecentEarning}>
                        <Image
                            source={require("../../assets/icons/payment.png")}
                            style={{ width: 20, height: 20 }}
                        />
                        <Text style={GajiStyles.textEarning}>
                            Recent Earning
                        </Text>
                    </View>
                    {!showAll && (
                        <TouchableOpacity
                            onPress={() => setShowAll(true)}
                            style={GajiStyles.showAllButton}
                        >
                            <Text>
                                Show All
                            </Text>
                        </TouchableOpacity>
                    )}
                    {showAll && (
                        <TouchableOpacity
                            onPress={() => setShowAll(false)}
                            style={GajiStyles.showAllButton}
                        >
                            <Text>
                                Show Less
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View>
                    {data.length > 0 ? (
                        <ScrollView
                            style={{
                                maxHeight: showAll ? 450 : undefined,
                            }}
                            showsVerticalScrollIndicator={showAll}
                        >
                            {displayedData.map((item) => {
                                return (
                                    <View key={item.id} style={GajiStyles.earningsBox}>
                                        <View style={GajiStyles.iconCircle}>
                                            <Image
                                                source={require("../../assets/icons/in.png")}
                                                style={GajiStyles.iconCheck}
                                            />
                                        </View>
                                        <View style={GajiStyles.earningsMiddle}>
                                            <Text style={GajiStyles.earningsDate}>
                                                {item.paymentDate}
                                            </Text>
                                            <Text style={GajiStyles.earningsStatus}>
                                                Received
                                            </Text>
                                        </View>
                                        <View style={GajiStyles.earningsRight}>
                                            <Text style={GajiStyles.earningsAmount}>
                                                    + {item.amount.toLocaleString("id-ID")}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    ) : (
                        <Text style={GajiStyles.noData}>Belum ada data</Text>
                    )}
                </View>
            </View>
        </View>
    )
}

export default GajiPage;