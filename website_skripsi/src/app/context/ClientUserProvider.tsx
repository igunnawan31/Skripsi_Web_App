"use client";
import { UserContext } from "./UserContext";

export default function ClientUserProvider({ user, children }: any) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
