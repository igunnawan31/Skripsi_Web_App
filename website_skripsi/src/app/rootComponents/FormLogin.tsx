"use client";

import Link from "next/link";
import Image from "next/image";
import { FormProps } from "../props/formProps";
import React, { useState } from "react";
import { useAuth } from "../lib/hooks/auth/useAuth";
import CustomToast from "./CustomToast";
import toast from "react-hot-toast";
import { logo } from "../lib/assets/assets";
import { useRouter } from "next/navigation";

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

    const verifyEmailMutation = verifyEmail();
    const verifyOTPMutation = verifyOTP();
    const resetPasswordMutation = resetPassword();

    const handleAction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string || emailCache;
        const otp = formData.get("otp") as string || otpCache;
        const newPassword = formData.get("newPassword") as string;

        if (loginState === "verifyemail") {
            verifyEmailMutation.mutate({ email }, {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="OTP sent to your email" />);
                    setEmailCache(email);
                    router.push("/forgot-password?state=verifyotp&email=" + email);
                },
                onError: (err) => toast.custom(<CustomToast type="error" message={err.message} />)
            });
        } 
        
        else if (loginState === "verifyotp") {
            verifyOTPMutation.mutate({ email, otp }, {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="OTP Verified" />);
                    setOtpCache(otp);
                    router.push(`/forgot-password?state=resetpassword&email=${email}&otp=${otp}`);
                },
                onError: (err) => toast.custom(<CustomToast type="error" message={err.message} />)
            });
        }

        else if (loginState === "resetpassword") {
            resetPasswordMutation.mutate({ email, otp, newPassword }, {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="Password reset successfully" />);
                    router.push("/");
                },
                onError: (err) => toast.custom(<CustomToast type="error" message={err.message} />)
            });
        }
    };
    
    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) return;
        
        setLoading(true);
        const loadingToastId = toast.loading("Logging in...");

        try {
            await login(email,  password);
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
                                    className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                    required
                                />
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
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        )}
                        {loginState === "verifyotp" && (
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                >
                                    OTP Code
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        )}
                        {loginState === "resetpassword" && (
                            <div className="flex flex-col">
                                <div>
                                    <label
                                        htmlFor="newpassword"
                                        className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newpassword"
                                        name="newpassword"
                                        className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="newpassword"
                                        className="block mb-2 text-sm font-medium text-(--color-text-secondary)"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newpassword"
                                        name="newpassword"
                                        className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-2.5 bg-(--color-primary) text-white font-semibold rounded-lg hover:bg-(--color-primary)/80 transition-all cursor-pointer"
                        >
                            {isLoading ? "Processing..." : textButton}
                        </button>

                        <div className="text-center text-sm mt-4">
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
