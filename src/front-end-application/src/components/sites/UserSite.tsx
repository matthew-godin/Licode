import React from "react";
import { Route, Routes } from "react-router-dom";
import Waitlist from "../pages/Waitlist/Waitlist";
import Dashboard from "../pages/Dashboard/Dashboard";
import DashboardRedirect from "../redirects/DashboardRedirect";
import VictoryScreen from "../pages/Victory/Victory";
import Defeat from "../pages/Defeat/Defeat";
import CodingEditor from "../pages/CodingEditor/CodingEditor";
import Home from "../pages/Home/Home";
import User from "../common/interfaces/User/User";
import Loading from "../common/Loading";

export interface UserSiteProps {
    user?: User,
    fetchUser: Function
}

function UserSite(props: UserSiteProps) {
    if (props.user?.loading) {
        return (
            <Loading />
        );
    }
    return (
        <React.Fragment>
            <main className="container">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard user={props.user} fetchUser={props.fetchUser} />} />
                    <Route path="/waitlist" element={<Waitlist />} />
                    <Route path="/editor" element={<CodingEditor />} />
                    <Route path="/victory" element={<VictoryScreen />} />
                    <Route path="/defeat" element={<Defeat />} />
                    <Route path="/register" element={<DashboardRedirect />} />
                    <Route path="/signin" element={<DashboardRedirect />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default UserSite;