import * as React from "react";
import { Box, Button, Typography, Grid, Stack, Table, Paper, TableContainer, TableBody, TableRow, TableCell } from "@mui/material"
import Image from '../images/BlueBackground.png';

export interface User {
    email: string;
    username: string;
    numWins: number;
    numLosses: number;
    eloRating: number;
}

export interface DashboardProps {
    user?: User,
    fetchUser: Function
}

export interface DashboardState { }



export interface WinLossProps {
    numWins?: number,
    numLosses?: number,
    eloRating?: number
}

function computeWinRate(numWins?: number, numLosses?: number) {
    if (!numWins || !numLosses) {
        return '0%';
    }
    let numGames = numWins + numLosses;
    if (numGames > 0) {
        return (numWins / numGames * 100).toFixed(2).toString() + '%';
    } else {
        return '0%';
    }
}

function WinLossTable(props: WinLossProps) {
    return (
        <TableContainer component={Paper}>
            <Table>                          
                <TableBody>
                    <TableRow>
                        <TableCell sx={{fontSize: 24}}>Rating: </TableCell>
                        <TableCell sx={{fontSize: 24}}>{props.eloRating}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontSize: 24}}>Number of Wins: </TableCell>
                        <TableCell sx={{fontSize: 24}}>{props.numWins}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontSize: 24}}>Number of Losses: </TableCell>
                        <TableCell sx={{fontSize: 24}}>{props.numLosses}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontSize: 24}}>Winrate: </TableCell>
                        <TableCell sx={{fontSize: 24}}>{computeWinRate(props.numWins, props.numLosses)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            user: {
                email: '',
                username: '',
                numWins: 500,
                numLosses: 500,
                eloRating: 5000
            }
        }
    }

    componentDidMount() {
        fetch('/api/user').then(response => response.json()).then((json) => {
            this.setState({
                user: json.user
            });
        })
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