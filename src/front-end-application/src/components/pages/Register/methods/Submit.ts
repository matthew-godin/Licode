import Register from "../Register";
import User from "../interfaces/User";

const submit = async (e: React.SyntheticEvent<HTMLFormElement>, that: Register) => {
    e.preventDefault();
    if (that.validateForm()) {
        let user: User = {
            email: { value: that.state.email },
            username: { value: that.state.username },
            password: { value: that.state.password },
            confirmPassword: { value: that.state.confirmPassword },
        }
        try {
            let res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            }).then(response => response.json());
            if (res.text) {
                that.setState({ errorMessage: res.text });
            } else {
                that.props.fetchUser();
            }
        } catch (err) {
            console.log(err);
        }
    } 
}

export default submit;
