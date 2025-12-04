import axiosInstance from "../axiosInstance"

export const loginRequest = async (email: string, password: string) => {
    const res = await axiosInstance.post("/auth/login", {email, password});
    return res.data;
}