import Handlers from "./Handlers";
import UserData from "./UserData";
import ValidationMessages from "./ValidationMessages";

export default interface RegisterData {
    handlers: Handlers;
    userData: UserData;
    errorMessage: string;
    validationMessages: ValidationMessages;
}
