"use client";

import { useUserLogin } from "@/app/context/UserContext";
import { icons, photo } from "@/app/lib/assets/assets";
import { useUser } from "@/app/lib/hooks/user/useUser";
import Image from "next/image";
import { useState } from "react";

const Profile = () => {
    const user = useUserLogin();
    const { data: fetchedData, isLoading, error } = useUser().fetchUserById(user.id);
    const [showModalEditPhoto, setShowModalEditPhoto] = useState(false);

    return (
        <div className="flex flex-col gap-6 w-full pb-8">
            <div className="flex items-center gap-4">
                <h1 className="text-yellow-600 font-semibold whitespace-nowrap">
                    My Profile
                </h1>
                <div className="flex-1 border-b-2 border-(--color-border)" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-8 relative">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-(--color-surface)">
                    <Image
                        src={photo.profilePlaceholder}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>
                <div
                    onClick={() => setShowModalEditPhoto((v) => !v)}
                    className="absolute left-20 top-17 p-2 bg-yellow-600 hover:bg-yellow-500 overflow-hidden rounded-full cursor-pointer"
                >
                    <Image 
                        src={icons.editLogo}
                        alt="Profile"
                        width={20}
                        height={20}
                    />
                </div>

                <div className="flex flex-col">
                    <h2 className="font-semibold text-(--color-text-primary)">
                        {user.name}
                    </h2>
                    <span className="text-sm text-yellow-600 font-medium">
                        {user.minorRole}
                    </span>
                    <span className="text-sm text-(--color-muted)">
                        {user.majorRole}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-700">
                        Personal Information
                    </h3>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-600 hover:bg-yellow-500 cursor-pointer text-white rounded-lg transition">
                        <Image 
                            src={icons.editLogo}
                            alt="Profile"
                            width={14}
                            height={14}
                        />
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <p className="text-gray-400">First Name</p>
                        <p className="font-medium text-gray-800">Natashia</p>
                    </div>

                    <div>
                        <p className="text-gray-400">Last Name</p>
                        <p className="font-medium text-gray-800">Khaleira</p>
                    </div>

                    <div>
                        <p className="text-gray-400">Date of Birth</p>
                        <p className="font-medium text-gray-800">12-10-1990</p>
                    </div>

                    <div>
                        <p className="text-gray-400">Email Address</p>
                        <p className="font-medium text-gray-800">
                            info@binary-fusion.com
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-400">Phone Number</p>
                        <p className="font-medium text-gray-800">
                            (+62) 821 2554-5846
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-400">User Role</p>
                        <p className="font-medium text-gray-800">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
