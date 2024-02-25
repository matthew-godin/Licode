import React, { useState, useEffect } from "react";
import UserSite from "./components/sites/UserSite";
import PublicSite from "./components/sites/PublicSite";
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

function App() {
    const [user, setUser] = useState(undefined);

    const fetchUser = () => {
        fetch('/api/user').then(response => response.json()).then((json) => {
            setUser(json.user);
        });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (user) {
        return (
            <UserSite user={user} fetchUser={fetchUser} />
        );
    }

    return (
        <PublicSite fetchUser={fetchUser} />
    );
}

export default App;