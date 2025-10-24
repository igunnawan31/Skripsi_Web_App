"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Navbar = () => {
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const dropdownRef = useRef(null);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        
        router.push("/sign-in");
        toast.success("Logout berhasil");
    };

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);
    
    const renderHtml = (
        <div className="w-full z-10">
            <div className="flex justify-end items-center p-5 bg-white">
                <div className="flex items-center gap-4 pr-2">
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
                        >
                            <span className="text-blue-900">
                                asdada
                                {user ? `${user.name} (${user.role} - ${user.subRole})` : "Loading..."}
                            </span>
                        </div>
                        {isDropdownMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white z-10">
                                <ul className="py-2 text-sm text-black">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
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

export default Navbar;