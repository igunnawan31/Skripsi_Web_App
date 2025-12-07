"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { HRMenuProps } from "../props/MenuProps";
import Image from "next/image";
import { icons, photo } from "@/app/lib/assets/assets";
import { User } from "@/app/lib/types/types";


export default function Navbar({ user }: { user: User }) {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
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
    
    const renderHtml = (
        <div className="w-full z-10 flex justify-between py-10">
            <div className="w-1/2 flex items-center font-semibold text-2xl text-(--color-text-primary) ">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-slate-800">{currentItem?.label}</h1>
                    <p className="text-sm text-slate-500">
                        {currentItem?.description}
                    </p>
                </div>
            </div>
            <div className="w-1/2 flex justify-end items-center">
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
                                <ul className="py-2 text-sm text-black">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    return renderHtml
}