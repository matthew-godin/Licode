export default interface UserData {
    username: string;
    onUsernameBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
    email: string;
    onEmailBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
    password: string;
    onPasswordBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
    confirmPassword: string;
    onConfirmPasswordBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
}
