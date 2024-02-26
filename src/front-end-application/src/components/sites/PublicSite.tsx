import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import LoginForm from "../pages/LoginForm";
import RegisterForm from "../pages/RegisterForm";
import LoginRedirect from "../redirects/LoginRedirect";

export interface PublicSiteProps {
    fetchUser: Function
}

function PublicSite(props: PublicSiteProps) {
    return (
        <React.Fragment>
            <main className="container">
                <Routes>
                    <Route path="/dashboard" element={<LoginRedirect />} />
                    <Route path="/waitlist" element={<LoginRedirect />} />
                    <Route path="/editor" element={<LoginRedirect />} />
                    <Route path="/victory" element={<LoginRedirect />} />
                    <Route path="/defeat" element={<LoginRedirect />} />
                    <Route path="/register" element={<RegisterForm fetchUser={props.fetchUser} />} />
                    <Route path="/signin" element={<LoginForm fetchUser={props.fetchUser} />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default PublicSite;