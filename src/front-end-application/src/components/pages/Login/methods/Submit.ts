import User from "../interfaces/User";
import Login from "../Login";

const submit = async (e: React.SyntheticEvent<HTMLFormElement>, that: Login) => {
    e.preventDefault();
    let user: User = {
        email: { value: '' },
        username: { value: '' },
        password: { value: '' },
    }
    user.email.value = (e.target as typeof e.target & User).email.value;
    user.password.value = (e.target as typeof e.target & User).password.value;
    try {
        let res = await fetch('/api/login', {
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

export default submit;
