"use client";

import Link from "next/link";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { useAuth } from "@/app/lib/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";

const MobileMenu = ({
    mobileMenuRef,
    menusToRender,
    pathname,
    openSidebarMenus,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleMenuClick,
    handleMenuItemClick,
    hasParentId,
    isSidebarOpen,
}: any) => {
    const {logout} = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        toast.custom(<CustomToast type="success" message={`Logout Successful`} />);
        router.push("/");
    }

    const renderHtml = (
        <div className="pt-6 lg:pt-0">
            <div className="flex lg:hidden items-center mb-4 justify-center">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-(--color-surface) focus:outline-none cursor-pointer"
                >
                    <div className="hover:bg-(--color-tertiary)/60 p-4 rounded-lg">
                        <Image
                            src={icons.hamburgerMenu}
                            width={20}
                            height={20}
                            alt={"Hamburger Menu"}
                        />
                    </div>
                </button>
            </div>
            
            {/* Icons Menu */}
            <div className="flex flex-col items-center justify-center gap-4 lg:hidden">
                {menusToRender.map((menu: any) => menu.items.length === 1 ? (
                    <Link
                        href={menu.items[0].href}
                        key={menu.items[0].label}
                        className={`flex items-center justify-between gap-4 p-4 rounded-xl text-sm ${
                        pathname === menu.items[0].href
                            ? "bg-(--color-tertiary) text-white font-semibold"
                            : "text-white hover:bg-(--color-tertiary)/60"
                        }`}
                    >
                        <Image src={menu.items[0].icon} width={20} height={20} alt={menu.items[0].alt} className="block" />
                    </Link>
                ) : (
                    <div key={menu.title} className="flex flex-col items-center gap-4">
                        {menu.items.map((item:any) => (
                            <Link
                                href={item.href}
                                key={item.label}
                                className={`flex items-center justify-between gap-4 p-4 rounded-xl text-sm ${
                                pathname === item.href
                                    ? "bg-(--color-tertiary) text-white font-semibold"
                                    : "text-white hover:bg-(--color-tertiary)/60"
                                }`}
                            >
                                <Image
                                    src={item.icon}
                                    width={20}
                                    height={20}
                                    alt={item.alt}
                                    className="block"
                                />
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            <div
                ref={mobileMenuRef}
                className={`fixed top-0 left-0 h-full w-3/4 bg-(--color-primary) z-50 flex flex-col p-6 lg:hidden overflow-y-auto transition-all duration-500 transform ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex lg:hidden items-center justify-end">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white focus:outline-none cursor-pointer"
                    >
                        <div className="hover:bg-(--color-tertiary)/60 p-4 rounded-lg">
                            <Image 
                                src={icons.closeMenu} 
                                width={20} 
                                height={20} 
                                alt={"Close Menu"} 
                            />
                        </div>
                    </button>
                </div>

                <div className="flex flex-col gap-3 text-lg mt-4">
                    {menusToRender.map((menu: any) => menu.items.length === 1 ? (
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
                                {isSidebarOpen && 
                                    <span className="block text-sm">
                                        {menu.items[0].label}
                                    </span>
                                }
                            </div>
                        </Link>
                        ) : (
                            <div key={menu.title}>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-white font-bold hover:bg-(--color-tertiary)/20 p-4 rounded-lg"
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
                                    <div className="flex flex-col gap-2 mt-3">
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
            </div>
            <div className="px-4 py-4 lg:py-0">
                <button 
                    className="flex lg:hidden bg-(--color-surface) w-full items-center justify-between px-4 py-4 gap-2 text-white rounded-lg hover:opacity-90 transition cursor-pointer"
                    onClick={handleLogout}
                >
                    <Image
                        src={icons.logoutPrimaryIcon}
                        alt="Logout Icon"
                        width={40}
                        height={40}
                        className="block lg:hidden mx-auto"
                    />
                </button>
            </div>
        </div>
    );

    return renderHtml;
};

export default MobileMenu;
