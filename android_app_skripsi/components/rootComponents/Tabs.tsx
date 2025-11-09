import HomePage from "@/app/(tabs)/home";
import CutiPage from "@/app/(tabs)/cuti";
import HistoryAbsensiPage from "@/app/(tabs)/history";
import ProfilePage from "@/app/(tabs)/profile";

import { tabStyles } from "@/assets/styles/rootstyles/tab.styles";
import { COLORS } from "@/constants/colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureResponderEvent, Image, Text, TouchableOpacity, View } from "react-native";
import CalendarPage from "@/app/(tabs)/calendar";

export type RootTabParamList = {
    "Home Page": undefined;
    "History Absensi Page": undefined;
    "Calendar Page": undefined;
    "Cuti Page": undefined;
    "Profile Page": undefined;
}

const Tab = createBottomTabNavigator<RootTabParamList>();

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{ 
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    backgroundColor: COLORS.white,
                    borderRadius: 15,
                    height: 60,
                    marginHorizontal: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    ...tabStyles.shadow
                }
            }}
        >
            <Tab.Screen name="Home Page" component={HomePage} options={{ 
                tabBarIcon: ({focused}) => (
                    <View style={tabStyles.tabIcons}>
                        <Image
                            source={require('../../assets/icons/home.png')}
                            resizeMode="contain"
                            style={{ 
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.primaryOpacity80
                            }}
                        />
                        <Text style={{ 
                            color: focused ? COLORS.primary : COLORS.primaryOpacity80,
                            ...tabStyles.textTabs 
                        }}>
                            Home
                        </Text>
                    </View>
                )
            }} />
            <Tab.Screen name="History Absensi Page" component={HistoryAbsensiPage} options={{ 
                tabBarIcon: ({focused}) => (
                    <View style={tabStyles.tabIcons}>
                        <Image
                            source={require('../../assets/icons/history.png')}
                            resizeMode="contain"
                            style={{ 
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.primaryOpacity80
                            }}
                        />
                        <Text style={{ 
                            color: focused ? COLORS.primary : COLORS.primaryOpacity80,
                            ...tabStyles.textTabs 
                        }}>
                            History
                        </Text>
                    </View>
                )
            }}/>
            <Tab.Screen name="Calendar Page" component={CalendarPage} options={{ 
                tabBarIcon: ({focused}) => (
                    <View style={tabStyles.tabIcons}>
                        <Image
                            source={require('../../assets/icons/calendar.png')}
                            resizeMode="contain"
                            style={{ 
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.primaryOpacity80
                            }}
                        />
                        <Text style={{ 
                            color: focused ? COLORS.primary : COLORS.primaryOpacity80,
                            ...tabStyles.textTabs 
                        }}>
                            Calendar
                        </Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Cuti Page" component={CutiPage} options={{ 
                tabBarIcon: ({focused}) => (
                    <View style={tabStyles.tabIcons}>
                        <Image
                            source={require('../../assets/icons/cuti.png')}
                            resizeMode="contain"
                            style={{ 
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.primaryOpacity80
                            }}
                        />
                        <Text style={{ 
                            color: focused ? COLORS.primary : COLORS.primaryOpacity80,
                            ...tabStyles.textTabs 
                        }}>
                            Cuti
                        </Text>
                    </View>
                )
            }} />
            <Tab.Screen name="Profile Page" component={ProfilePage} options={{ 
                tabBarIcon: ({focused}) => (
                    <View style={tabStyles.tabIcons}>
                        <Image
                            source={require('../../assets/icons/user.png')}
                            resizeMode="contain"
                            style={{ 
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.primaryOpacity80
                            }}
                        />
                        <Text style={{ 
                            color: focused ? COLORS.primary : COLORS.primaryOpacity80,
                            ...tabStyles.textTabs 
                        }}>
                            Profil
                        </Text>
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

export default Tabs;