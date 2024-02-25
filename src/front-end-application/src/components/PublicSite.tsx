import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./home";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import HomeRedirect from "./homeRedirect";

export interface PublicSiteProps {
    fetchUser: Function
}

function PublicSite(props: PublicSiteProps) {
    return (
        <React.Fragment>
            <main className="container">
                <Routes>
                    <Route path="/dashboard" element={<HomeRedirect />} />
                    <Route path="/waitlist" element={<HomeRedirect />} />
                    <Route path="/editor" element={<HomeRedirect />} />
                    <Route path="/victory" element={<HomeRedirect />} />
                    <Route path="/defeat" element={<HomeRedirect />} />
                    <Route path="/register" element={<RegisterForm fetchUser={props.fetchUser} />} />
                    <Route path="/signin" element={<LoginForm fetchUser={props.fetchUser} />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default PublicSite;