import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Dimensions, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import CardExplanation from '@/components/welcomeComponents/CardExplanation';
import { useRouter } from 'expo-router';
import CardForgotPassword from '@/components/authComponents/Forgot-Password/CardForgotPassword';
import reimburseStyles from '@/assets/styles/rootstyles/reimburse/reimburse.styles';
import COLORS from '@/constants/colors';
import ButtonForgotPassword from '@/components/authComponents/Forgot-Password/ButtonForgotPassword';
import InputForgotPassword from '@/components/authComponents/Forgot-Password/InputForgotPassword';
import { homeStyles } from '@/assets/styles/rootstyles/home/home.styles';
import { cutiDetailStyles } from '@/assets/styles/rootstyles/cuti/cutidetail.styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { profileStyles } from '@/assets/styles/rootstyles/profiles/profile.styles';

const ChangePassword = () => {
    const router = useRouter();
    const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    
    const handleAskOtp = () => {
        setShowOTP(true);
    }

    const handleNext = () => {
        setIsVerificationSuccess(true);
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={profileStyles.header}>
                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => router.back()}
                >
                    <View style={profileStyles.iconPlace}>
                        <Image
                            style={profileStyles.iconBack}
                            source={require("../../../assets/icons/arrow-left.png")}
                        />
                    </View>
                    <Text style={profileStyles.headerTitle}>Kembali</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 90 }}
                contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 20
                }}
                enableOnAndroid={true}
                extraScrollHeight={150}
                keyboardShouldPersistTaps="handled"
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing || isFetching}
                //         onRefresh={onRefresh}
                //         colors={[COLORS.primary]}
                //         tintColor={COLORS.primary}
                //         progressViewOffset={HEADER_HEIGHT}
                //     />
                // }
            >
                <View style={profileStyles.firstContainer}>
                    <Text style={profileStyles.titleFirst}>Change Password</Text>
                    <Text style={profileStyles.descriptionFirst}>Enter the email associated with your account and we'll send an email with OTP Code to change your password</Text>

                    {!isVerificationSuccess ? (
                        <>
                            {/* <View style={cutiDetailStyles.createFormContainer}> */}
                                {!showOTP ? (
                                    <InputForgotPassword title="Email Account" placeholder="Enter Email" />
                                ) : (
                                    <InputForgotPassword title="OTP Code" placeholder="Enter OTP" isOTP={true} />
                                )}
                                <ButtonForgotPassword
                                    text={!showOTP ? "Ask for OTP Code" : "Verify OTP"}
                                    onPress={!showOTP ? handleAskOtp : handleNext}
                                />
                            {/* </View> */}
                        </>
                    ) : (
                        <View style={authStyles.fullWrapper}>
                            <Image 
                                source={require("../../../assets/images/welcome-1.png")} 
                                style={authStyles.image}
                                resizeMode="contain"
                            />
                            <Text style={authStyles.successTitle}>
                                Verification Successful!
                            </Text>
                            <Text style={authStyles.descriptionSuccess}>
                                You can now reset your password or go back to the login screen.
                            </Text>
                            <TouchableOpacity
                                style={[authStyles.buttonVerification]}
                                onPress={() => router.back()}
                            >
                                <Text style={authStyles.buttonText}>Back to Sign-In</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default ChangePassword;