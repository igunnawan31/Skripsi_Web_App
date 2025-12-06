"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { MenuProps } from "../props/MenuProps";
import Image from "next/image";
import { photo } from "@/app/lib/assets/assets";
import { User } from "@/app/lib/types/types";


export default function Navbar({ user }: { user: User }) {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const pathname = usePathname();
    const currentItem = MenuProps.flatMap((menu) => menu.items || []).find(
        (item) => item.href === pathname
    );
    const dropdownRef = useRef(null);
    const router = useRouter();
    
    const renderHtml = (
        <div className="w-full z-10 flex justify-between py-10">
            <div className="flex items-center font-semibold text-2xl text-(--color-text-primary) ">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-slate-800">{currentItem?.label}</h1>
                    <p className="text-sm text-slate-500">
                        {currentItem?.description}
                    </p>
                </div>
            </div>
            <div className="flex justify-end items-center">
                <div className="flex items-center gap-4">
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
                        >
                            <div className="flex lg:hidden items-center justify-center border-b border-(--color-surface)">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-gray-400 overflow-hidden w-16 h-16 border-2 border-(--color-surface)">
                                        <Image
                                            src={photo.profilePlaceholder}
                                            alt="Profile Picture"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-(--color-textPrimary)">
                                        {user ? `${user.name} (${user.majorRole} - ${user?.minorRole})` : "Loading..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {isDropdownMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 z-10">
                                <ul className="py-2 text-sm text-black">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                                        Logout
                                    </li> */}
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