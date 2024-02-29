import { validateEmail, validatePassword, validateUsername } from '../../../common/Validation';
import Register from '../Register';

//called with annoying = false by handleUserInput to
//warn user of errors
//called with annoying = true by handleSubmit
//to find ALL errors
//use if(!annoying) {
//      allow obviously invalid input as to not annoy user
//    }
export const validateField = (fieldName: string, value: string, that: Register, annoying: boolean = false) => {
    var valMsgs = that.state.validationMessages;
    switch (fieldName) {
        case 'username':
            valMsgs.username = validateUsername(value, annoying);
            break;
        case 'email':
            valMsgs.email = validateEmail(value, annoying);
            break;
        case 'password':
            valMsgs.password = validatePassword(value, annoying);
            break;
        case 'confirmPassword':
            if (!annoying && (value === "" || that.state.password === "")) {
                valMsgs.confirmPassword = ''
            } else if (that.state.password !== value) {
                valMsgs.confirmPassword = "Passwords do not match";
            } else {
                valMsgs.confirmPassword = '';
            }
            break;
        default:
            break;
    }
    that.setState({validationMessages: valMsgs}, () => {
        //revalidate confirmPassword if password was validated
        if (fieldName === "password") {
            validateField("confirmPassword", that.state.confirmPassword, that);
        }
    });
}

const validate = (that: Register): boolean => {
    validateField("username", that.state.username, that, true);
    validateField("email", that.state.email, that, true);
    validateField("password", that.state.password, that, true);
    validateField("confirmPassword", that.state.confirmPassword, that, true);

    return that.state.validationMessages.username === ""
        && that.state.validationMessages.email === "" 
        && that.state.validationMessages.password === ""
        && that.state.validationMessages.confirmPassword === "";
}

export default validate;
