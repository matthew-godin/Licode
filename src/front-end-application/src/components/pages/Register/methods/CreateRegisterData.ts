import FieldData from "../interfaces/FieldData";
import Handlers from "../interfaces/Handlers";
import RegisterData from "../interfaces/RegisterData";
import UserData from "../interfaces/UserData";
import Register from "../Register";

const createRegisterData = (that: Register): RegisterData => {
    let handlers: Handlers = {
        handleSubmit: that.handleSubmit,
        handleUserInput: that.handleUserInput
    };
    let usernameData: FieldData = {
        field: that.state.username,
        onFieldBlur: that.onUsernameBlur
    };
    let emailData: FieldData = {
        field: that.state.email,
        onFieldBlur: that.onEmailBlur
    };
    let passwordData: FieldData = {
        field: that.state.password,
        onFieldBlur: that.onPasswordBlur
    };
    let confirmPasswordData: FieldData = {
        field: that.state.confirmPassword,
        onFieldBlur: that.onConfirmPasswordBlur
    };
    let userData: UserData = {
        usernameData: usernameData,
        emailData: emailData,
        passwordData: passwordData,
        confirmPasswordData: confirmPasswordData
    };
    let registerData: RegisterData = {
        handlers: handlers,
        userData: userData,
        errorMessage: that.state.errorMessage,
        validationMessages: that.state.validationMessages
    };
    return registerData;
};

export default createRegisterData;
