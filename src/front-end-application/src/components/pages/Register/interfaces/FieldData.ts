export default interface FieldData {
    field: string;
    onFieldBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
}
