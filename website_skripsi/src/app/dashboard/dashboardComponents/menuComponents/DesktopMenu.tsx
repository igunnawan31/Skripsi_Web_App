"use client";

import Link from "next/link";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";

const DesktopMenu = ({
    menusToRender,
    pathname,
    openSidebarMenus,
    handleMenuClick,
    handleMenuItemClick,
    hasParentId,
    isSidebarOpen,
}: any) => {
    const renderHtml = (
        <div className="hidden px-4 justify-between lg:flex lg:flex-col">
            <div>
                {menusToRender.map((menu: any) =>
                    menu.items.length === 1 ? (
                    <Link
                        href={menu.items[0].href}
                        key={menu.items[0].label}
                        className={`flex items-center justify-between gap-4 p-4 rounded-xl text-sm mt-4 ${
                        pathname === menu.items[0].href
                            ? "bg-(--color-tertiary) text-white font-semibold"
                            : "text-white hover:bg-(--color-tertiary)/60"
                        }`}
                        onClick={handleMenuItemClick}
                    >
                        <div className="flex items-center gap-4">
                            <Image 
                                src={menu.items[0].icon} 
                                width={20} 
                                height={20} 
                                alt={menu.items[0].alt} 
                            />
                            <span className="hidden lg:block">{menu.items[0].label}</span>
                        </div>
                    </Link>
                    ) : (
                    <div className="flex flex-col mt-4" key={menu.title}>
                        <div
                            className="flex justify-between items-center cursor-pointer text-white font-bold hover:bg-(--color-tertiary)/60 p-4 rounded-xl"
                            onClick={() => handleMenuClick(menu.title)}
                        >
                            <span className="text-sm">{menu.title}</span>
                            <Image 
                                src={icons.arrowMenu} 
                                width={20} 
                                height={20} 
                                alt={"Arrow Menu"}
                                className={`transition-transform duration-300 ${
                                    openSidebarMenus[menu.title] ? "rotate-90" : "rotate-0"
                                }`} 
                            />
                        </div>

                        {openSidebarMenus[menu.title] && (
                            <div className="flex flex-col gap-2 cursor-pointer">
                                {menu.items.map((item: any) => (
                                <Link
                                    href={item.href}
                                    key={item.label}
                                    className={`flex items-center justify-between gap-4 p-4 rounded-xl text-sm mt-4 ${
                                    pathname === item.href
                                        ? "bg-(--color-tertiary) text-white font-semibold"
                                        : "text-white hover:bg-(--color-tertiary)/60"
                                    }`}
                                    onClick={handleMenuItemClick}
                                >
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={item.icon}
                                            width={20} 
                                            height={20} 
                                            alt={item.alt} 
                                        />
                                        {isSidebarOpen && 
                                            <span className="block text-sm">
                                                {item.label}
                                            </span>
                                        }
                                    </div>
                                </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    )
                )}
            </div>
            <div className="flex py-4 justify-end">
                <button className="bg-(--color-surface) w-full flex items-center justify-between px-4 gap-2 text-white rounded-lg py-4 hover:opacity-90 transition cursor-pointer">
                    <span className="hidden md:block text-(--color-primary)">Keluar</span>
                    <span className="hidden md:block text-lg text-(--color-primary)">→</span>
                    <Image
                        src={icons.logoutPrimaryIcon}
                        alt="Logout Icon"
                        width={20}
                        height={20}
                        className="block md:hidden mx-auto"
                    />
                </button>
            </div>
        </div>
    );

    return renderHtml;
};

export default DesktopMenu;
