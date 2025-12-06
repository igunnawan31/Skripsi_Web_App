"use client";

import Link from "next/link";
import Image from "next/image";
import { FormProps } from "../props/formProps";
import React from "react";
import { useAuth } from "../lib/hooks/auth/useAuth";

const FormLogin: React.FC<FormProps> = ({
    loginAccount = false, 
    textButton,
    textTitle,
}) => {
    const { login, isLoggingIn, loginError } = useAuth();
    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return;
        }
        try {
            await login(email,  password);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const renderHtml = (
        <section className="min-h-screen flex flex-col justify-center items-center px-4 bg-(--color-background)">
            <div className="flex flex-col items-center mb-10">
                <Image
                    src="/assets/images/logoBerinovasi.png"
                    alt="Logo"
                    width={120}
                    height={60}
                    className="mb-3"
                />
                <span className="text-lg font-semibold text-(--color-secondary) tracking-wide">
                    Berinovasi HRIS
                </span>
            </div>

            <div className="w-full max-w-2xl bg-(--color-surface) rounded-2xl shadow-lg border border-(--color-border) p-8">
                <h1 className="text-2xl font-bold text-center text-(--color-text-primary) mb-6">
                    {textTitle}
                </h1>
                {loginAccount ? (
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
                            {loginError && <p className="text-red-600 text-sm">{(loginError as Error).message ?? "Login gagal, cek kredensial."}</p>}
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
                                {isLoggingIn ? "Logging in..." : textButton}
                            </button>
                        </form>
                    </>
                ) : (
                    <form className="space-y-5">
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
                                className="w-full p-2.5 border border-(--color-border) rounded-lg bg-(--color-background) text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary) focus:outline-none transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-(--color-primary) text-white font-semibold rounded-lg hover:bg-(--color-primary)/80 transition-all cursor-pointer"
                        >
                            {textButton}
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
