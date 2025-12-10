"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { HRMenuProps } from "../props/MenuProps";
import Image from "next/image";
import { icons, photo } from "@/app/lib/assets/assets";
import { User } from "@/app/lib/types/types";
import Link from "next/link";
import { useAuth } from "@/app/lib/hooks/auth/useAuth";
import CustomToast from "@/app/rootComponents/CustomToast";


export default function Navbar({ user, withDropdown }: { user: User, withDropdown?: boolean }) {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const {logout, isLoggingIn, loginError } = useAuth();
    const pathname = usePathname();
    const currentItem = HRMenuProps.flatMap((menu) => menu.items || []).find(
        (item) => item.href === pathname
    );
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        toast.custom(<CustomToast type="success" message={`Logout Successful`} />);
        router.push("/");
    }
    
    const renderHtml = (
        <div className="w-full z-10 flex justify-between py-10">
            <div className="w-1/2 flex items-center font-semibold text-2xl text-(--color-text-primary) ">
                <div className="flex flex-col">
                    <h1 className="
                        text-lg sm:text-xl md:text-2xl 
                        font-bold text-slate-800 leading-snug
                    ">
                        {currentItem?.label}
                    </h1>

                    <p className="
                        text-xs sm:text-sm md:text-base 
                        text-slate-500 text-justify leading-relaxed max-w-full
                    ">
                        {currentItem?.description}
                    </p>
                </div>
            </div>
            {withDropdown === true && (
                <div className="w-1/2 flex justify-end items-start md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
                            >
                                <div className="flex lg:hidden items-center justify-center bg-(--color-surface) px-3 py-2 rounded-xl shadow-md gap-1 md:gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-gray-400 overflow-hidden w-16 h-16 border-2 border-(--color-surface)">
                                            <Image
                                                src={photo.profilePlaceholder}
                                                alt="Profile Picture"
                                                width={128}
                                                height={128}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="hidden md:block text-sm font-semibold text-(--color-textPrimary)">
                                                {user ? `${user.name}`: "Loading..."}
                                            </h2>
                                            <p className="hidden md:block text-xs rounded-full text-(--color-textPrimary)">
                                                {user ? `${user.majorRole}` : "Loading..."}
                                            </p>
                                            <p className="hidden md:block text-xs rounded-full text-(--color-textPrimary)">
                                                {user ? `${user.minorRole}` : "Loading..."}
                                            </p>
                                        </div>
                                    </div>
                                    <Image 
                                        src={isDropdownMenuOpen ? icons.arrowDropdown : icons.arrowDropdown}
                                        alt="Dropdown Arrow"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            </div>
                            {isDropdownMenuOpen && (
                                <div className="absolute right-0 mt-2 w-full z-10 bg-(--color-surface) rounded-xl shadow-md">
                                    <ul className="text-(--color-textPrimary) flex flex-col p-4 gap-4">
                                        <Link 
                                            href={"/dashboard/profile"}
                                            className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:underline rounded-lg"
                                        >
                                            <Image 
                                                src={icons.userProfile}
                                                alt="Profile Icon"
                                                width={24}
                                                height={24}
                                                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                                            />
                                            <p className="text-xs sm:text-sm md:text-base">
                                                My Profile
                                            </p>
                                        </Link>

                                        <li 
                                            onClick={handleLogout}
                                            className="px-3 sm:px-4 py-3 sm:py-4 cursor-pointer bg-(--color-tertiary)/80 
                                            text-white rounded-lg flex items-center gap-3 sm:gap-4 
                                            hover:bg-(--color-tertiary) hover:underline"
                                        >
                                            <Image 
                                                src={icons.logoutWhiteIcon}
                                                alt="Logout Icon"
                                                width={20}
                                                height={20}
                                                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                                            />
                                            <p className="text-xs sm:text-sm md:text-base">
                                                Logout
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    return renderHtml
}