import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import WaitList from "./components/waitList";
import Dashboard from "./components/dashboard";
import DashboardRedirect from "./components/dashboardRedirect";
import HomeRedirect from "./components/homeRedirect";
import VictoryScreen from "./components/victoryScreen";
import DefeatScreen from "./components/defeatScreen";
import CodingEditor from "./components/codingEditor";
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

    if (!user) {
        return (
            <React.Fragment>
                <main className="container">
                    <Routes>
                        <Route path="/test" element={<Dashboard fetchUser={fetchUser} />}/>
                        <Route path="/dashboard" element={<HomeRedirect />} />
                        <Route path="/waitlist" element={<HomeRedirect />} />
                        <Route path="/editor" element={<HomeRedirect />} />
                        <Route path="/victory" element={<HomeRedirect />} />
                        <Route path="/defeat" element={<HomeRedirect />} />
                        <Route path="/register" element={<RegisterForm fetchUser={fetchUser} />} />
                        <Route path="/signin" element={<LoginForm fetchUser={fetchUser} />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </main>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <main className="container">
                <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} fetchUser={fetchUser} />} />
                        <Route path="/waitlist" element={<WaitList />} />
                        <Route path="/editor" element={<CodingEditor />} />
                        <Route path="/register" element={<DashboardRedirect />} />
                        <Route path="/signin" element={<DashboardRedirect />} />
                        <Route path="/victory" element={<VictoryScreen />} />
                        <Route path="/defeat" element={<DefeatScreen />} />
                        <Route path="/" element={<DashboardRedirect />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default App;