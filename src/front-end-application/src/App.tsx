import { useState, useEffect } from "react";
import UserSite from "./components/sites/UserSite";
import PublicSite from "./components/sites/PublicSite";
import { createBrowserHistory } from 'history';
import User from "./components/common/interfaces/User";

export const history = createBrowserHistory();

function App() {
    const [user, setUser] = useState<User>({ loading: true });

    const fetchUser = () => {
        fetch('/api/user').then(response => response.json()).then((json) => {
            setUser(json.user);
        });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (user) {
        console.log("USUSUSUSUSUSUSUSUSUSUSUSUUSUSUSUSUSU");
        return (
            <UserSite user={user} fetchUser={fetchUser} />
        );
    }
    console.log("PBPBPBPBPBPBPBPBPBPBPBPPBPBPBPBPBPBPBPBPPBPBP");

    return (
        <PublicSite fetchUser={fetchUser} />
    );
}

export default App;