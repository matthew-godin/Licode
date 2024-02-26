import * as React from "react";
import { createTheme, Box, Button, Stack, Paper, IconButton, } from "@mui/material"


export interface DefeatScreenProps { }

export interface DefeatScreenState { }

const styles = {
    paperContainer: {
        backgroundColor: '#94171b',
        backgroundPosition: "center",
        backgroundSize: "cover",
        border:"0px"
    }
};

class DefeatScreen extends React.Component<DefeatScreenProps, DefeatScreenState>{

    render() {
        return (
            <Paper style={styles.paperContainer}>
                <Box
                    display="flex"
                    alignItems="center" 
                    justifyContent="center"
                    minHeight="100vh"
                    //sx={{ bgcolor:'primary.light' }}
                >
                    <Stack
                        spacing={4}
                        sx={{ bgcolor:'background.paper', fontFamily: 'Varela Round', fontSize: 92, border:5, p:2, borderColor: '#d32f2f', textAlign: 'center'}} 
                    >
                        DEFEAT
                        <Stack direction="row" spacing={0}>
                            <Button fullWidth
                                    variant="contained"
                                    color = "error"
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

export default DefeatScreen;