"use client";

import Link from "next/link";
import Image from "next/image";
import { FormProps } from "../props/formProps";
import React, { useState } from "react";
import { useAuth } from "../lib/hooks/auth/useAuth";
import CustomToast from "./CustomToast";
import toast from "react-hot-toast";
import { icons, logo } from "../lib/assets/assets";
import { useRouter, useSearchParams } from "next/navigation";

const FormLogin: React.FC<FormProps> = ({
    loginAccount = false,
    textButton,
    textTitle,
    loginState = "login",
}) => {
    const router = useRouter();
    const { login, isLoggingIn, loginError, verifyEmail, verifyOTP, resetPassword } = useAuth();
    const [ loading, setLoading ] = useState(false);

    const [emailCache, setEmailCache] = useState("");
    const [otpCache, setOtpCache] = useState("");
    const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
    const [resendTimer, setResendTimer] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        new: "",
        confirm: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });
    const isPasswordMatched = passwords.new === passwords.confirm && passwords.new !== "";

    const verifyEmailMutation = verifyEmail();
    const verifyOTPMutation = verifyOTP();
    const resetPasswordMutation = resetPassword();

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false; // Only allow numbers

        const newOtp = [...otpValues];
        newOtp[index] = element.value.substring(element.value.length - 1);
        setOtpValues(newOtp);

        if (element.value && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otpValues[index] && e.currentTarget.previousSibling) {
            (e.currentTarget.previousSibling as HTMLInputElement).focus();
        }
    };

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleAction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({ email: "", otp: "", password: "", confirmPassword: "" });
        
        const formData = new FormData(e.currentTarget);
        
        const searchParams = new URLSearchParams(window.location.search);
        const currentEmail = emailCache || searchParams.get("email") || "";
        const currentOtp = otpCache || searchParams.get("otp") || "";

        if (loginState === "verifyemail") {
            const inputEmail = formData.get("email") as string;

            if (!inputEmail || inputEmail.trim() === "") {
                setErrors(prev => ({ ...prev, email: "Email is required" }));
                return;
            }

            verifyEmailMutation.mutate({ email: inputEmail }, {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="OTP sent!" />);
                    setEmailCache(inputEmail);
                    router.push(`/forgot-password?state=verifyotp&email=${inputEmail}`);
                },
                onError: (err) => toast.custom(<CustomToast type="error" message={err.message} />)
            });
        } 
        
        else if (loginState === "verifyotp") {
            const inputOtp = otpValues.join("");

            if (inputOtp.length !== 6) {
                setErrors(prev => ({ ...prev, otp: "Please enter the full 6-digit code" }));
                return;
            }

            verifyOTPMutation.mutate({ email: currentEmail, otp: inputOtp }, {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="OTP Verified" />);
                    setOtpCache(inputOtp);
                    router.push(`/forgot-password?state=resetpassword&email=${currentEmail}&otp=${inputOtp}`);
                },
                onError: (err) => toast.custom(<CustomToast type="error" message={err.message} />)
            });
        }

        else if (loginState === "resetpassword") {
            const newPassword = passwords.new;

            let hasError = false;
            if (newPassword.length < 8) {
                setErrors(prev => ({ ...prev, password: "Password must be at least 8 characters" }));
                hasError = true;
            }
            if (!isPasswordMatched) {
                setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
                hasError = true;
            }
            
            if (hasError) return;

            resetPasswordMutation.mutate({ 
                email: currentEmail, 
                otp: currentOtp, 
                newPassword 
            }, {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="Password reset successfully" />);
                    router.push("/");
                },
                onError: (err) => toast.custom(<CustomToast type="error" message={err.message} />)
            });
        }
    };

    const handleResendOTP = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const emailToResend = emailCache || searchParams.get("email") || "";

        if (!emailToResend) {
            toast.custom(<CustomToast type="error" message="Email not found. Please go back." />);
            return;
        }

        verifyEmailMutation.mutate({ email: emailToResend }, {
            onSuccess: () => {
                toast.custom(<CustomToast type="success" message="New OTP sent to your email!" />);
                setResendTimer(60);
                setOtpValues(new Array(6).fill(""));
            },
            onError: (err) => {
                toast.custom(<CustomToast type="error" message={err.message} />);
            }
        });
    };
    
    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({ email: "", otp: "", password: "", confirmPassword: "" });

        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        let hasError = false;

        if (!email || email.trim() === "") {
            setErrors(prev => ({ ...prev, email: "Email is required" }));
            hasError = true;
        }

        if (!password || password.trim() === "") {
            setErrors(prev => ({ ...prev, password: "Password is required" }));
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);
        const loadingToastId = toast.loading("Logging in...");

        try {
            await login(email, password);
            toast.dismiss(loadingToastId);
            toast.custom(<CustomToast type="success" message={`Login successful!, welcome ${email}`} />);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.custom(<CustomToast type="error" message="Login failed, please check your credentials!" />);
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const isLoading = isLoggingIn || verifyEmailMutation.isPending || verifyOTPMutation.isPending || resetPasswordMutation.isPending;

    const renderHtml = (
        <section className="min-h-screen flex flex-col justify-center items-center px-4 bg-(--color-background)">
            <div className="flex flex-col items-center mb-10">
                <Image
                    src={logo.logoBerinovasi}
                    width={160}
                    height={160}
                    alt="Logo Perusahaan Berinovasi"
                />
                <span className="text-lg font-semibold text-(--color-secondary) tracking-wide">
                    Berinovasi HRIS
                </span>
            </div>

            <div className="w-full max-w-2xl bg-(--color-surface) rounded-2xl shadow-lg border border-(--color-border) p-8">
                <h1 className="text-2xl font-bold text-center text-(--color-text-primary) mb-6">
                    {textTitle}
                </h1>

                {loginState === "login" ? (
                    <>
                        <form className="space-y-5" onSubmit={handleSubmitLogin}>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-(--color-border)'}`}
                                    placeholder="name@company.com"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div className="relative">
                                <label className="block mb-2 text-sm font-medium text-(--color-text-secondary)">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`w-full p-2.5 border rounded-lg bg-(--color-background) focus:ring-2 focus:ring-(--color-primary) focus:outline-none ${errors.password ? 'border-red-500' : 'border-(--color-border)'}`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-10 text-gray-500 hover:text-(--color-primary)"
                                >
                                    {showPassword ?
                                        <Image 
                                            src={icons.openEye}
                                            width={20}
                                            height={20}
                                            alt="Open Password"
                                        />
                                    : (
                                        <Image 
                                            src={icons.closeEye}
                                            width={20}
                                            height={20}
                                            alt="Close Password"
                                        />
                                    )} 
                                </button>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            </div>
                            {loginError && (
                                <p className="text-red-600 text-sm">
                                    {(loginError as Error).message ?? "Login gagal, cek kredensial."}
                                </p>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-(--color-text-secondary)">
                                <input
                                    type="checkbox"
                                    className="accent-(--color-primary) w-4 h-4 rounded focus:ring-(--color-primary) cursor-pointer"
                                />
                                    Remember me
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-(--color-primary) hover:underline font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full py-2.5 bg-(--color-primary) text-white font-semibold rounded-lg hover:bg-(--color-primary)/80 transition-all cursor-pointer"
                            >
                                {isLoading ? "Logging in..." : textButton}
                            </button>
                        </form>
                    </>
                ) : (
                    <form className="space-y-5" onSubmit={handleAction}>
                        {loginState === "verifyemail" && (
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Your email <span className="text-(--color-primary)">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-(--color-border)'}`}
                                    placeholder="name@company.com"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                        )}
                        {loginState === "verifyotp" && (
                            <div className="flex flex-col items-center">
                                <label className="block mb-4 text-sm font-medium text-(--color-text-secondary) self-start">
                                    OTP Code <span className="text-(--color-primary)">*</span>
                                </label>
                                
                                <div className="flex gap-2 sm:gap-4 justify-between w-full">
                                    {otpValues.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onFocus={(e) => e.target.select()}
                                            className={`w-10 h-12 sm:w-14 sm:h-16 text-center text-xl font-bold border rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all ${
                                                errors.otp ? 'border-red-500' : 'border-(--color-border)'
                                            }`}
                                        />
                                    ))}
                                </div>
                                
                                {errors.otp && (
                                    <p className="mt-4 text-xs text-red-500 self-start">{errors.otp}</p>
                                )}
                                
                                <div className="mt-6 text-center text-sm text-(--color-text-secondary) flex items-center justify-center gap-2">
                                    <p>Didn't receive the code?</p>
                                    {resendTimer > 0 ? (
                                        <p className="font-medium text-(--color-muted)">
                                            Resend available in <span className="text-(--color-primary)">{resendTimer}s</span>
                                        </p>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={verifyEmailMutation.isPending}
                                            onClick={handleResendOTP}
                                            className="text-(--color-primary) font-bold hover:underline disabled:opacity-50 transition-all"
                                        >
                                            {verifyEmailMutation.isPending ? "Sending..." : "Resend OTP Code"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {loginState === "resetpassword" && (
                            <div className="flex flex-col space-y-4">
                                <div className="relative">
                                    <label className="block mb-2 text-sm font-medium text-(--color-text-secondary)">
                                        New Password (Min 8 Character) <span className="text-(--color-primary)">*</span>
                                    </label>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                        className={`w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) focus:ring-2 focus:ring-(--color-primary) focus:outline-none ${errors.password ? 'border-red-500' : 'border-(--color-border)'}`}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-10 text-gray-500 hover:text-(--color-primary)"
                                    >
                                        {showNewPassword ?
                                            <Image 
                                                src={icons.openEye}
                                                width={20}
                                                height={20}
                                                alt="Open Password"
                                            />
                                        : (
                                            <Image 
                                                src={icons.closeEye}
                                                width={20}
                                                height={20}
                                                alt="Close Password"
                                            />
                                        )} 
                                    </button>
                                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                                </div>
                                <div className="relative">
                                    <label className="block mb-2 text-sm font-medium text-(--color-text-secondary)">
                                        Confirmation New Password <span className="text-(--color-primary)">*</span>
                                    </label>
                                    <input
                                        type={showConfirmationPassword ? "text" : "password"}
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                        className={`w-full p-2.5 border rounded-lg bg-(--color-background) focus:outline-none focus:ring-2 ${
                                            errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-(--color-border) focus:ring-(--color-primary)"
                                        }`}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmationPassword(!showConfirmationPassword)}
                                        className="absolute right-3 top-10 text-gray-500 hover:text-(--color-primary)"
                                    >
                                        {showConfirmationPassword ?
                                            <Image 
                                                src={icons.openEye}
                                                width={20}
                                                height={20}
                                                alt="Open Password"
                                            />
                                        : (
                                            <Image 
                                                src={icons.closeEye}
                                                width={20}
                                                height={20}
                                                alt="Close Password"
                                            />
                                        )} 
                                    </button>
                                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                                </div>
                                {passwords.confirm && !isPasswordMatched && (
                                    <p className="text-xs text-red-500">Passwords do not match yet.</p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || (loginState === "resetpassword" && !isPasswordMatched)}
                            className="w-full py-2.5 bg-(--color-primary) text-white font-semibold rounded-lg disabled:bg-gray-400 transition-all cursor-pointer"
                        >
                            {isLoading ? "Processing..." : textButton}
                        </button>

                        <div className="text-center text-sm">
                            <Link
                                href="/"
                                className="text-(--color-primary) hover:underline font-medium"
                            >
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );

    return renderHtml;
};

export default FormLogin;
