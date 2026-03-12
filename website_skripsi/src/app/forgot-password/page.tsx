"use client";

import FormLogin from "../rootComponents/FormLogin";
import { useSearchParams } from "next/navigation";

const ForgotPassword = () => {
    const searchParams = useSearchParams();
    const currentState = (searchParams.get("state") as any) || "verifyemail";

    const getFormConfig = () => {
        switch (currentState) {
            case "verifyotp":
                return { title: "Enter OTP", button: "Verify OTP" };
            case "resetpassword":
                return { title: "Set New Password", button: "Update Password" };
            default:
                return { title: "Forgot Password", button: "Send Reset Link" };
        }
    };

    const config = getFormConfig();

    return (
        <FormLogin 
            textButton={config.button} 
            textTitle={config.title} 
            loginState={currentState} 
        />
    );
}

export default ForgotPassword;