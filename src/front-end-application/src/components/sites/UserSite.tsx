import React from "react";
import { Route, Routes } from "react-router-dom";
import Waitlist from "../pages/Waitlist";
import Dashboard from "../pages/Dashboard";
import DashboardRedirect from "../redirects/DashboardRedirect";
import VictoryScreen from "../pages/VictoryScreen";
import DefeatScreen from "../pages/DefeatScreen";
import CodingEditor from "../pages/CodingEditor/CodingEditor";
import Home from "../pages/Home";
import User from "../common/interfaces/User";
import Loading from "../common/Loading";

export interface UserSiteProps {
    user?: User,
    fetchUser: Function
}

function UserSite(props: UserSiteProps) {
    return (
        <React.Fragment>
            <main className="container">
                <Routes>
                    <Route path="/dashboard" element={props.user?.loading ? <Loading /> : <Dashboard user={props.user} fetchUser={props.fetchUser} />} />
                    <Route path="/waitlist" element={props.user?.loading ? <Loading /> : <Waitlist />} />
                    <Route path="/editor" element={props.user?.loading ? <Loading /> : <CodingEditor />} />
                    <Route path="/victory" element={props.user?.loading ? <Loading /> : <VictoryScreen />} />
                    <Route path="/defeat" element={props.user?.loading ? <Loading /> : <DefeatScreen />} />
                    <Route path="/register" element={props.user?.loading ? <Loading /> : <DashboardRedirect />} />
                    <Route path="/signin" element={props.user?.loading ? <Loading /> : <DashboardRedirect />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default UserSite;