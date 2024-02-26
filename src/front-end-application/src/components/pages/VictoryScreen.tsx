import * as React from "react";
import { Box, Button, Stack, Paper, Typography } from "@mui/material";


export interface VictoryScreenProps { }

export interface VictoryScreenState { }

const styles = {
    paperContainer: {
        backgroundColor: '#fdc332',
        backgroundPosition: "center",
        backgroundSize: "cover",
        border:"0px"
    }
};

class VictoryScreen extends React.Component<VictoryScreenProps, VictoryScreenState>{

    render() {
        return (
            <Paper style={styles.paperContainer}>
                <Box
                    display="flex"
                    alignItems="center" 
                    justifyContent="center"
                    minHeight="100vh"
                >
                    <Stack
                        spacing={4}
                        sx={{ bgcolor:'background.paper', fontFamily: 'Varela Round', fontSize: 92, border:5, p:2, borderColor: '#f09d03', textAlign: 'center'}} 
                    >
                        VICTORY
                        <Stack direction="row" spacing={0}>
                            <Button fullWidth
                                    variant="contained"
                                    color = 'success'
                                    href="/licode/dashboard"
                                    sx={{fontFamily: 'Varela Round', fontSize: 36}}
                            >
                                Return to Dashboard
                            </Button>
                        </Stack>                        
                    </Stack>
                </Box>
            </Paper>
        );
    }
}

export default VictoryScreen;