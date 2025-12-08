"use client";

import { useEffect, useRef, useState } from "react";
import { HRMenuProps, OwnerMenuProps } from "../props/MenuProps";
import Link from "next/link";
import Image from "next/image";
import { icons, photo } from "@/app/lib/assets/assets";
import { usePathname } from "next/navigation";
import MobileMenu from "./menuComponents/MobileMenu";
import DesktopMenu from "./menuComponents/DesktopMenu";
import { MajorRole, MinorRole, User } from "@/app/lib/types/types";

export default function SidebarMenu({ user }: { user: User }) {
    const [openSidebarMenus, setOpenSidebarMenus] = useState<{ [key: string]: boolean }>({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasParentId, setHasParentId] = useState<boolean | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const [menusToRender, setMenusToRender] = useState<any[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        let selectedMenus: any[] = [];
        if (user?.majorRole === MajorRole.OWNER) {
            selectedMenus = OwnerMenuProps;
        } else if (user?.majorRole === String(MajorRole.KARYAWAN) && user?.minorRole === String(MinorRole.HR)) {
            selectedMenus = HRMenuProps;
        }
        setMenusToRender(selectedMenus);
        setOpenSidebarMenus(Object.fromEntries(selectedMenus.map((menu) => [menu.title, false])));
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                closeMobileMenu();
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "auto";
        };
    }, [isMobileMenuOpen]);

    const handleMenuClick = (title: string) => {
        setOpenSidebarMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleMenuItemClick = () => {
        closeMobileMenu();
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMobileMenuOpen]);

    const renderHtml = (
        <div className="w-full bg-(--color-primary) text-(--color-text-primary) min-h-screen flex flex-col h-full justify-between">
            <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="lg:flex hidden items-center justify-center pt-6 pb-2 border-b border-(--color-surface) mb-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-gray-400 overflow-hidden w-16 h-16 border-2 border-(--color-surface)">
                            <Image
                                src={photo.profilePlaceholder}
                                alt="Profile Picture"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="hidden md:block text-sm font-semibold text-(--color-surface)">
                                {user ? `${user.name}` : "Loading..."}
                            </h2>
                            <p className="hidden md:block text-xs rounded-full text-(--color-surface) px-3 py-1">
                                {user ? `(${user.majorRole} - ${user?.minorRole})` : "Loading..."}
                            </p>
                        </div>
                    </div>
                </div>
                <MobileMenu
                    mobileMenuRef={mobileMenuRef}
                    menusToRender={menusToRender}
                    pathname={pathname}
                    openSidebarMenus={openSidebarMenus}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    handleMenuClick={handleMenuClick}
                    handleMenuItemClick={handleMenuItemClick}
                    hasParentId={hasParentId}
                    isSidebarOpen={isSidebarOpen}
                />

                <DesktopMenu
                    menusToRender={menusToRender}
                    pathname={pathname}
                    openSidebarMenus={openSidebarMenus}
                    handleMenuClick={handleMenuClick}
                    handleMenuItemClick={handleMenuItemClick}
                    hasParentId={hasParentId}
                    isSidebarOpen={isSidebarOpen}
                />
            </div>
        </div>
    );

    return renderHtml;
}
