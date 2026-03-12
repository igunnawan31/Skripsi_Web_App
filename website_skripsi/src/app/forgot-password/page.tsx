import FormLogin from "../rootComponents/FormLogin";

const ForgotPassword = () => {
    const renderHtml = (
        <>
            <FormLogin textButton="Send Reset Link" textTitle="Forgot Password" loginState="verifyemail" />
        </>
    );
    return renderHtml;
}

export default ForgotPassword;