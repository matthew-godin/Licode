import React, { useState, useCallback } from "react";
import http from "./services/httpService";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import CodingEditor from "./components/codingEditor";
import Dashboard from "./components/dashboard";

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') === '1');
    const getToken = useCallback(() => {
        setToken(true);
        localStorage.setItem('token', '1');
    }, []);
    const giveToken = useCallback(() => {
        setToken(false);
        localStorage.setItem('token', '0');
    }, []);

    if (!token) {
        return (
            <React.Fragment>
                <main className="container">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard setToken={giveToken} />} />
                        <Route path="/editor" element={<CodingEditor />} />
                        <Route path="/register" element={<RegisterForm setToken={getToken} />} />
                        <Route path="/signin" element={<LoginForm setToken={getToken} />} />
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
                <Route path="/dashboard" element={<Dashboard setToken={giveToken} />} />
                        <Route path="/editor" element={<CodingEditor />} />
                        <Route path="/register" element={<Dashboard setToken={giveToken} />} />
                        <Route path="/signin" element={<Dashboard setToken={giveToken} />} />
                        <Route path="/" element={<Dashboard setToken={giveToken} />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default App;