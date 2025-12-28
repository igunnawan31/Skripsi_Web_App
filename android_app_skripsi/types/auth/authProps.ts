export type CardLoginProps = {
    title: string;
    email: string;
    password: string;
    onEmailChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
    onSubmit: () => void;
    loading?: boolean;
    errorMsg?: string;
}

export type InputLoginProps = {
    title: string;
    placeholder: string;
    secureTextEntry?: boolean;
    value: string;
    onChangeText: (v: string) => void;
};

export type ButtonSignInProps = {
    text: string,
    onPress: () => void;
    disabled?: boolean;
};