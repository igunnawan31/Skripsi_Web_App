import FormLogin from "../rootComponents/FormLogin";

const ForgotPassword = () => {
    const renderHtml = (
        <>
            <FormLogin textButton="Send Reset Link" textTitle="Forgot Password" />
        </>
    );
    return renderHtml;
}

export default ForgotPassword;