import Image from "next/image";
import { icons } from "../lib/assets/assets";

interface CustomToastProps {
    type: "success" | "error" | "info";
    message: string;
};

const CustomToast: React.FC<CustomToastProps> = ({ type, message }) => {
    const isSuccess = type === "success";
    const isError = type === "error";
    const messageColor = isSuccess ? "text-(--color-success)" : type === "error" ? "text-(--color-primary)" : "text-(--color-info)";
    const icon = isSuccess ? (
        <Image src={icons.successIcon} alt="Success" width={24} height={24} />
    ) : isError ? (
        <Image src={icons.errorIcon} alt="Error" width={24} height={24} />
    ) : (
        <Image src={icons.infoIcon} alt="Info" width={24} height={24} />
    );

    return (
        <div className="flex items-center p-4 rounded-lg shadow-md bg-(--color-background) text-white">
            <span className="text-2xl mr-3">{icon}</span>
            <span className={`font-medium ${messageColor}`}>{message}</span>
        </div>
    );
}

export default CustomToast;