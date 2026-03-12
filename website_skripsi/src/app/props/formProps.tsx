export type FormProps = {
    loginAccount?: boolean;
    textButton?: string;
    textTitle?: string;
    loginState?: "verifyemail" | "verifyotp" | "login" | "resetpassword" 
}