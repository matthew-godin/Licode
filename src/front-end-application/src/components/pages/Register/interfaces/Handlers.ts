export default interface Handlers {
    handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
    handleUserInput: React.FormEventHandler<HTMLFormElement> | undefined;
}
