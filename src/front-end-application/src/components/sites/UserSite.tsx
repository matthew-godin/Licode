import React from "react";
import { Route, Routes } from "react-router-dom";
import Waitlist from "../pages/Waitlist";
import Dashboard from "../pages/Dashboard";
import DashboardRedirect from "../redirects/DashboardRedirect";
import VictoryScreen from "../pages/VictoryScreen";
import DefeatScreen from "../pages/DefeatScreen";
import CodingEditor from "../pages/codingEditor/CodingEditor";
import Home from "../pages/Home";
import User from "../common/interfaces/User";
import { Box, Typography } from "@mui/material"

export interface UserSiteProps {
    user?: User,
    fetchUser: Function
}

function UserSite(props: UserSiteProps) {
    if (props.user?.loading) {
        return (
            <Box
                height="100vh"
                sx={{ backgroundColor: '#01182a', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
                display="flex" 
                flexDirection="column"
            >
                <Typography sx={{textAlign: 'center', marginTop: '3vh'}}>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </Typography>
            </Box>
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
                    <Route path="/defeat" element={<DefeatScreen/>} />
                    <Route path="/register" element={<DashboardRedirect />} />
                    <Route path="/signin" element={<DashboardRedirect />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </React.Fragment>
    );
}

export default UserSite;