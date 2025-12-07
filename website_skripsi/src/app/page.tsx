import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginSection from "./rootComponents/LoginSection";
import toast from "react-hot-toast";
import CustomToast from "./rootComponents/CustomToast";

export default async function Home() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      redirect("/dashboard?alreadyLoggedIn=true");
    }

    return <LoginSection />;
}
