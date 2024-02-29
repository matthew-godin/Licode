import ValidationMessages from "./interfaces/ValidationMessages";

export default interface RegisterState {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    errorMessage: string;
    validationMessages: ValidationMessages;
}
