import Register from "../Register";

// update state and validate after
// any input changes
const userInput = async (e: React.SyntheticEvent<HTMLFormElement>, that: Register) => {
    const inputTarget = e.target as EventTarget & HTMLInputElement;
    const field = inputTarget.name;
    const value = inputTarget.value;
    var stateObj : any = {[field] : value};
    that.setState(stateObj);
}

export default userInput;
