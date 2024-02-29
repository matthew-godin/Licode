import FieldData from "../../../../interfaces/FieldData";

export default interface PasswordProps {
    passwordData: FieldData,
    passwordInputType: string,
    showPasswords: boolean,
    toggleShowPassword: () => void
}
