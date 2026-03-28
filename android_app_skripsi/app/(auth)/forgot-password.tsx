import { View, Text, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { authStyles } from '@/assets/styles/authstyles/auth.styles';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/api/hooks/useAuth';
import COLORS from '@/constants/colors';
import { profileStyles } from '@/assets/styles/rootstyles/profiles/profile.styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import NotificationModal from '@/components/rootComponents/NotificationModal';

const { width } = Dimensions.get("window");

const ForgotPassword = () => {
  const router = useRouter();
  const { verifyEmail, verifyOTP, resetPassword} = useAuth();
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const [currentState, setCurrentState] = useState<"verifyemail" | "verifyotp" | "resetpassword">("verifyemail");
  const [emailCache, setEmailCache] = useState("");
  const [otpCache, setOtpCache] = useState("");
  
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  
  const [passwords, setPasswords] = useState({ new: "", confirm: ""});
  const [isSecure, setIsSecure] = useState(false);
  const [isSecureConfirmation, setIsSecureConfirmation] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmation, setIsFocusedConfirmation] = useState(false);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ 
    email: "", 
    otp: "", 
    password: "", 
    confirmPassword: "" 
  });

  const [notification, setNotification] = useState<{
    visible: boolean;
    status: "success" | "error";
    title?: string;
    description?: string;
  }>({
    visible: false,
    status: "success",
  });

  const verifyEmailMutation = verifyEmail();
  const verifyOtpMutation = verifyOTP();
  const resetPasswordMutation = resetPassword();

  const isLoading = verifyEmailMutation.isPending || verifyOtpMutation.isPending || resetPasswordMutation.isPending;
  const isPasswordMatched = passwords.new === passwords.confirm && passwords.new !== "";

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendTimer > 0) {
        interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otpValues];
    newOtp[index] = value.replace(/[^0-9]/g, "").slice(-1);
    setOtpValues(newOtp);

    if (value && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1]?.focus();
    }
  };

  const getTitle = () => {
    if (currentState === "verifyemail") return "Verifikasi Email";
    if (currentState === "verifyotp") return "Masukkan Kode OTP";
    return "Reset Password";
  };

  const getDescription = () => {
    if (currentState === "verifyemail") return "Masukkan email yang terhubung dengan akun Anda, kami akan mengirimkan kode OTP.";
    if (currentState === "verifyotp") return `Kode OTP telah dikirim ke ${emailCache}. Masukkan kode 6 digit tersebut.`;
    return "Buat password baru untuk akun Anda.";
  };

  const getButtonText = () => {
    if (isLoading) return "Memproses...";
    if (currentState === "verifyemail") return "Kirim Kode OTP";
    if (currentState === "verifyotp") return "Verifikasi OTP";
    return "Reset Password";
  };

  const handleAction = () => {
    setErrors({ email: "", otp: "", password: "", confirmPassword: "" });

    if (currentState === "verifyemail") {
      if (!email.trim()) {
        setErrors(prev => ({ ...prev, email: "Email wajib diisi" }));
        return;
      }
      verifyEmailMutation.mutate({ email }, {
        onSuccess: () => {
            setEmailCache(email);
            setNotification({ visible: true, status: "success", title: "Berhasil", description: "Kode OTP telah dikirim ke email Anda." });
            setCurrentState("verifyotp");
        },
        onError: (err: any) => {
            setNotification({ visible: true, status: "error", title: "Gagal", description: err?.message || "Terjadi kesalahan." });
        },
      });
    }

    else if (currentState === "verifyotp") {
      const otp = otpValues.join("");
      if (otp.length !== 6) {
        setErrors(prev => ({ ...prev, otp: "Masukkan 6 digit kode OTP" }));
        return;
      }
      verifyOtpMutation.mutate({ email: emailCache, otp }, {
        onSuccess: () => {
          setOtpCache(otp);
          setNotification({ visible: true, status: "success", title: "Berhasil", description: "OTP terverifikasi." });
          setCurrentState("resetpassword");
        },
        onError: (err: any) => {
          setNotification({ visible: true, status: "error", title: "Gagal", description: err?.message || "OTP tidak valid." });
        },
      });
    }

    else if (currentState === "resetpassword") {
      let hasError = false;
      if (passwords.new.length < 8) {
        setErrors(prev => ({ ...prev, password: "Password minimal 8 karakter" }));
        hasError = true;
      }
      if (!isPasswordMatched) {
        setErrors(prev => ({ ...prev, confirmPassword: "Password tidak cocok" }));
        hasError = true;
      }
      if (hasError) return;

      resetPasswordMutation.mutate({ email: emailCache, otp: otpCache, newPassword: passwords.new }, {
        onSuccess: () => {
          setNotification({ visible: true, status: "success", title: "Berhasil", description: "Password berhasil direset." });
          setTimeout(() => router.back(), 1500);
        },
        onError: (err: any) => {
          setNotification({ visible: true, status: "error", title: "Gagal", description: err?.message || "Terjadi kesalahan." });
        },
      });
    }
  };

  const handleResendOTP = () => {
    verifyEmailMutation.mutate({ email: emailCache }, {
      onSuccess: () => {
        setResendTimer(60);
        setOtpValues(new Array(6).fill(""));
        setNotification({ visible: true, status: "success", title: "Berhasil", description: "Kode OTP baru telah dikirim." });
      },
      onError: (err: any) => {
        setNotification({ visible: true, status: "error", title: "Gagal", description: err?.message || "Gagal mengirim OTP." });
      },
    });
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={profileStyles.header}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              if (currentState === "verifyotp") setCurrentState("verifyemail");
              else if (currentState === "resetpassword") setCurrentState("verifyotp");
              else router.back();
            }}
          >
            <View style={profileStyles.iconPlace}>
              <Image
                style={profileStyles.iconBack}
                source={require("../../assets/icons/arrow-left.png")}
              />
            </View>
            <Text style={profileStyles.headerTitle}>Kembali</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 90 }}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 40, paddingHorizontal: 20 }}
          enableOnAndroid={true}
          extraScrollHeight={150}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 28, marginTop: 8 }}>
            {(["verifyemail", "verifyotp", "resetpassword"]).map((step, i) => (
              <React.Fragment key={step}>
                <View style={{
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: currentState === step || (i < ["verifyemail", "verifyotp", "resetpassword"].indexOf(currentState)) ? COLORS.primary : COLORS.border,
                  alignItems: "center", justifyContent: "center"
                }}>
                  <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: "600" }}>{i + 1}</Text>
                </View>
                {i < 2 && (
                  <View style={{
                      flex: 1, height: 2,
                      backgroundColor: i < ["verifyemail", "verifyotp", "resetpassword"].indexOf(currentState) ? COLORS.primary : COLORS.border
                    }} 
                  />
                )}
              </React.Fragment>
            ))}
          </View>
          <View style={{ width: "100%", marginBottom: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: COLORS.textPrimary, marginBottom: 8 }}>
              {getTitle()}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 20 }}>
              {getDescription()}
            </Text>
          </View>
          {currentState === "verifyemail" && (
            <View style={{ width: "100%", gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: COLORS.textSecondary }}>
                Email <Text style={{ color: COLORS.primary }}>*</Text>
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  width: "100%", borderWidth: 1,
                  borderColor: errors.email ? COLORS.error : COLORS.border,
                  borderRadius: 10, padding: 12, fontSize: 14,
                  color: COLORS.textPrimary, backgroundColor: COLORS.background,
                }}
              />
              {errors.email && <Text style={{ fontSize: 12, color: COLORS.error }}>{errors.email}</Text>}
            </View>
          )}
          {currentState === "verifyotp" && (
            <View style={{ width: "100%", gap: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: COLORS.textSecondary }}>
                Kode OTP <Text style={{ color: COLORS.primary }}>*</Text>
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                {otpValues.map((val, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { otpRefs.current[index] = ref }}
                    value={val}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    maxLength={1}
                    keyboardType="number-pad"
                    style={{
                      flex: 1, height: 52, borderWidth: 1,
                      borderColor: errors.otp ? COLORS.error : COLORS.border,
                      borderRadius: 10, textAlign: "center",
                      fontSize: 20, fontWeight: "bold", color: COLORS.textPrimary,
                      backgroundColor: COLORS.background,
                    }}
                  />
                ))}
              </View>
              {errors.otp && <Text style={{ fontSize: 12, color: COLORS.error }}>{errors.otp}</Text>}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                <Text style={{ fontSize: 13, color: COLORS.textMuted }}>Tidak menerima kode?</Text>
                {resendTimer > 0 ? (
                  <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
                    Kirim ulang dalam <Text style={{ color: COLORS.primary }}>{resendTimer}s</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP} disabled={verifyEmailMutation.isPending}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: COLORS.primary }}>
                      Kirim Ulang
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          {currentState === "resetpassword" && (
            <View style={{ width: "100%", gap: 16 }}>
              <View style={{ gap: 6 }}>
                <Text style={authStyles.inputTitle}>
                  Password Baru (Min. 8 karakter) <Text style={{ color: COLORS.primary }}>*</Text>
                </Text>
                <View style={{
                  ...authStyles.input,
                  borderColor: isFocusedPassword ? COLORS.primary : COLORS.border,
                  borderWidth: isFocusedPassword ? 2 : 1,
                  backgroundColor: 'transparent'
                }}>
                  <TextInput
                    value={passwords.new}
                    onChangeText={(text) => setPasswords(prev => ({ ...prev, new: text }))}
                    onFocus={() => setIsFocusedPassword(true)}
                    onBlur={() => setIsFocusedPassword(false)}
                    secureTextEntry={!isSecure}
                    placeholder="••••••••"
                    style={{
                      flex: 1,
                      padding: 12,
                      fontSize: 14,
                      color: COLORS.textPrimary,
                    }}
                  />
                  <TouchableOpacity 
                    onPress={() => setIsSecure(!isSecure)}
                    style={{ paddingRight: 12, paddingLeft: 8 }}
                  >
                    <Ionicons 
                      name={isSecure ? "eye" : "eye-off"} 
                      size={20} 
                      color={COLORS.primary || "#9CA3AF"} 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={{ fontSize: 12, color: COLORS.error }}>{errors.password}</Text>}
              </View>
              <View style={{ gap: 6 }}>
                <Text style={authStyles.inputTitle}>
                  Konfirmasi Password <Text style={{ color: COLORS.primary }}>*</Text>
                </Text>
                <View style={{
                  ...authStyles.input,
                  borderColor: isFocusedConfirmation ? COLORS.primary : COLORS.border,
                  borderWidth: isFocusedConfirmation ? 2 : 1,
                  backgroundColor: 'transparent'
                }}>
                  <TextInput
                    value={passwords.confirm}
                    onChangeText={(text) => setPasswords(prev => ({ ...prev, confirm: text }))}
                    secureTextEntry={!isSecureConfirmation}
                    onFocus={() => setIsFocusedConfirmation(true)}
                    onBlur={() => setIsFocusedConfirmation(false)}
                    placeholder="••••••••"
                    style={{
                      flex: 1,
                      padding: 12,
                      fontSize: 14,
                      color: COLORS.textPrimary,
                    }}
                  />
                  <TouchableOpacity 
                    onPress={() => setIsSecureConfirmation(!isSecureConfirmation)}
                    style={{ paddingRight: 12, paddingLeft: 8 }}
                  >
                    <Ionicons 
                      name={isSecureConfirmation ? "eye" : "eye-off"} 
                      size={20} 
                      color={COLORS.primary || COLORS.textPrimary} 
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={{ fontSize: 12, color: COLORS.error }}>{errors.confirmPassword}</Text>}
                {passwords.confirm !== "" && !isPasswordMatched && (
                    <Text style={{ fontSize: 12, color: COLORS.error }}>Password belum cocok</Text>
                )}
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={handleAction}
            disabled={isLoading || (currentState === "resetpassword" && !isPasswordMatched)}
            style={{
              width: "100%", padding: 14, borderRadius: 10, marginTop: 24,
              backgroundColor: (isLoading || (currentState === "resetpassword" && !isPasswordMatched))
                ? COLORS.muted : COLORS.primary,
              alignItems: "center",
            }}
          >
            <Text style={{ color: COLORS.white, fontWeight: "600", fontSize: 15 }}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: "500" }}>
              Kembali ke login page
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
      <NotificationModal
        visible={notification.visible}
        status={notification.status}
        title={notification.title}
        description={notification.description}
        onContinue={() => setNotification(prev => ({ ...prev, visible: false }))}
        buttonText='Lanjutkan'
      />
    </>
  )
}

export default ForgotPassword;