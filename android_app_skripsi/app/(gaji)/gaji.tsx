import { GajiStyles } from "@/assets/styles/rootstyles/gaji/gaji.styles";
import COLORS from "@/constants/colors";
import { dummyGaji } from "@/data/dummyGaji";
import { useSalary } from "@/lib/api/hooks/useSalary";
import { SalaryResponse, SalaryStatus } from "@/types/salary/salaryTypes";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const GajiPage = () => {
    const router = useRouter();
    const { data, isLoading, error } = useSalary().fetchAllSalary();
    const [showAll, setShowAll] = useState(false);
    const [showCurrency, setShowCurrency] = useState(true);

    const filteredData = data?.data ?? [];
    const paidData = filteredData.filter((item: SalaryResponse) => item.status === SalaryStatus.PAID);
    const displayedData = showAll ? paidData : paidData.slice(0,5);

    const totalCurrency = paidData.reduce((sum: number, item: SalaryResponse) => sum + item.amount, 0);

    if (isLoading) {
            return (
                <View style={GajiStyles.container}>
                    <Text>Loading absensi data...</Text>
                </View>
            );
        }
    
        if (error) {
            return (
                <View style={GajiStyles.container}>
                    <Text>Error: {error.message}</Text>
                </View>
            );
        }

    return (
        <View style={GajiStyles.container}>
            <View style={GajiStyles.header}>
                <Svg
                    height="180"
                    width="250"
                    viewBox="0 0 600 600"
                    style={GajiStyles.headerBlob}
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
                    style={GajiStyles.headerBlob}
                >
                    <Path 
                        fill="#A5D8FF"
                        opacity="0.4" 
                        d="M54.2,-67.6C69.8,-63.3,81.7,-46.9,80.2,-30.9C78.7,-15,63.9,0.5,53.8,13.2C43.8,26,38.6,36,30.5,42.4C22.3,48.8,11.1,51.6,-2.8,55.5C-16.8,59.3,-33.6,64.3,-42.2,58C-50.8,51.8,-51.3,34.3,-58.3,17.8C-65.3,1.2,-78.8,-14.4,-78.5,-28.6C-78.1,-42.7,-63.8,-55.4,-48.4,-59.7C-33,-64.1,-16.5,-60.1,1.4,-62C19.3,-64,38.6,-71.9,54.2,-67.6Z" 
                        transform="translate(100 100)" 
                    />   
                </Svg>
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
                <View style={GajiStyles.firstContainer}>
                    <View style={GajiStyles.currencyInformation}>
                        <View style={GajiStyles.gapCurrency}>
                            <Image
                                source={require('../../assets/icons/rupiah.png')}
                                style={GajiStyles.icons}
                            />
                            <Text style={GajiStyles.textCurrency}>Total</Text>
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
                    {displayedData.length > 5 && (
                        <>
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
                        </>
                    )}
                </View>
                <View>
                    {displayedData.length > 0 ? (
                        <ScrollView
                            style={{
                                maxHeight: showAll ? 400 : undefined,
                            }}
                            showsVerticalScrollIndicator={showAll}
                        >
                            {displayedData.map((item: any) => {
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
                                                {item.paymentDate ? format(new Date(item.paymentDate), "dd-MM-yyyy") : "-"}
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