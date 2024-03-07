import * as React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import WinLossTable from "./components/WinLossTable";
import DashboardProps from "./DashboardProps";
import DashboardState from "./DashboardState";

class Dashboard extends React.Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout () {
        await fetch('/api/logout');
        this.props.fetchUser();
    };

    render() {
        return (
            <Box
                height="100vh"
                sx={{ backgroundColor: '#01182a', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
                display="flex" 
                flexDirection="column"
            >
                <Typography sx={{ position: 'fixed', left: 30, top: 30, fontSize: 56, color: 'white' }}>
                    Welcome, {this.props.user?.username}
                </Typography>
                <Box
                    display="flex"
                    alignItems="center" 
                    justifyContent="center"
                    minHeight="80vh"
                >
                    <Stack
                        spacing={2}
                        sx={{ bgcolor:'background.paper', border:5, p:2, borderColor: 'primary.main', width: '80vw', marginTop: '15vh'}} 
                    >
                        <Typography
                            align='center'
                            color="common.white"
                            sx={{bgcolor:'text.disabled', borderRadius:1, p:1, fontSize: 32}}
                        >
                            STATS
                        </Typography>
                        <WinLossTable numWins={this.props.user?.numWins} numLosses={this.props.user?.numLosses} eloRating={this.props.user?.eloRating} />
                        <Button 
                            fullWidth variant="contained"
                            href="/licode/waitlist"
                            sx={{fontSize: 32}}                                        
                        >
                            PLAY 
                        </Button>
                        <Button variant="contained" onClick={this.handleLogout} sx={{fontSize: 32}}>
                            LOGOUT
                        </Button>
                    </Stack>
                </Box>
            </Box>
        );
    }
}

export default Dashboard;
