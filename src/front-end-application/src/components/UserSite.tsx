import React from "react";
import { Route, Routes } from "react-router-dom";
import WaitList from "./waitList";
import Dashboard, { User } from "./dashboard";
import DashboardRedirect from "./dashboardRedirect";
import VictoryScreen from "./victoryScreen";
import DefeatScreen from "./defeatScreen";
import CodingEditor from "./codingEditor";

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
                    <Route path="/waitlist" element={<WaitList />} />
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