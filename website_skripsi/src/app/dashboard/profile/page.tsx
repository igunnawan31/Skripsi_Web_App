"use client";

import { useUserLogin } from "@/app/context/UserContext";

const Profile = () => {
    const user = useUserLogin();
    
    return (
        <div>
            <h1>Profile Page</h1>
            <p>{user.name}</p>
        </div>
    );
}

export default Profile;