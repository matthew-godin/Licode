import Handlers from "../interfaces/Handlers";
import RegisterData from "../interfaces/RegisterData";
import UserData from "../interfaces/UserData";
import Register from "../Register";

const createRegisterData = (that: Register): RegisterData => {
    let handlers: Handlers = {
        handleSubmit: that.handleSubmit,
        handleUserInput: that.handleUserInput
    };
    let userData: UserData = {
        username: that.state.username,
        onUsernameBlur: that.onUsernameBlur,
        email: that.state.email,
        onEmailBlur: that.onEmailBlur,
        password: that.state.password,
        onPasswordBlur: that.onPasswordBlur,
        confirmPassword: that.state.confirmPassword,
        onConfirmPasswordBlur: that.onConfirmPasswordBlur
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
