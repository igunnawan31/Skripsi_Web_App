"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { illustrations } from "../lib/assets/assets";

const BannerLogin = () => {
    return (
        <section className="w-full md:rounded-l-4xl relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden bg-linear-to-br from-(--color-primary) via-yellow-600 to-pink-500 animate-gradient">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
                <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse delay-300"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 flex flex-col justify-center items-center text-center"
            >
                <Image
                    src={illustrations.welcomeIllustration}
                    alt="HRIS Illustration"
                    width={400}
                    height={400}
                    className="mb-6 animate-float"
                />

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    Welcome to HRIS Berinovasi
                </h1>
                <p className="text-lg text-white/90 max-w-md mb-6">
                    Please log in to access your account and manage your HR tasks efficiently.
                </p>
            </motion.div>

            <footer className="absolute bottom-4 text-white/70 text-sm z-10">
                © {new Date().getFullYear()} HRIS Berinovasi. All rights reserved.
            </footer>

            <style jsx>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 10s ease infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </section>
    );
};

export default BannerLogin;
