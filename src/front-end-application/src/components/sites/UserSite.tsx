import React from "react";
import { Route, Routes } from "react-router-dom";
import Waitlist from "../pages/Waitlist";
import Dashboard, { User } from "../pages/Dashboard";
import DashboardRedirect from "../redirects/DashboardRedirect";
import VictoryScreen from "../pages/VictoryScreen";
import DefeatScreen from "../pages/DefeatScreen";
import CodingEditor from "../pages/codingEditor/CodingEditor";

export interface UserSiteProps {
    user?: User,
    fetchUser: Function
}

function UserSite(props: UserSiteProps) {
    return (
        <React.Fragment>
            <main className="container">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard user={props.user} fetchUser={props.fetchUser} />} />
                    <Route path="/waitlist" element={<Waitlist />} />
                    <Route path="/editor" element={<CodingEditor />} />
                    <Route path="/victory" element={<VictoryScreen />} />
                    <Route path="/defeat" element={<DefeatScreen />} />
                    <Route path="/register" element={<DashboardRedirect />} />
                    <Route path="/signin" element={<DashboardRedirect />} />
                    <Route path="/" element={<DashboardRedirect />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default UserSite;