"use client";

import FormLogin from "./FormLogin";
import BannerLogin from "./BannerLogin";

const LoginSection = () => {
    const renderHtml = (
        <div className="w-full min-h-screen flex flex-col-reverse md:flex-row bg-(--color-background) overflow-y-auto">
            <div className="w-full md:w-1/2 h-auto md:h-screen flex justify-center items-center order-2 md:order-1">
                <FormLogin textTitle="Sign In to Your Account" loginAccount textButton="Sign In" />
            </div>

            <div className="w-full md:w-1/2 h-auto md:h-screen rounded-t-4xl md:rounded-none md:rounded-l-4xl flex justify-center items-center order-1 md:order-2">
                <BannerLogin />
            </div>
        </div>
    );

    return renderHtml;
};

export default LoginSection;
