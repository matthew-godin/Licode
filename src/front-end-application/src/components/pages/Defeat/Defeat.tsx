import * as React from "react";
import { Box, Button, Stack, Paper } from "@mui/material"
import { DefeatProps } from "./DefeatProps";
import { DefeatState } from "./DefeatState";

const styles = {
    paperContainer: {
        backgroundColor: '#94171b',
        backgroundPosition: "center",
        backgroundSize: "cover",
        border:"0px"
    }
};

class Defeat extends React.Component<DefeatProps, DefeatState>{
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
                        sx={{ bgcolor:'background.paper', fontFamily: 'Varela Round',
                            fontSize: 92, border:5, p:2, borderColor: '#d32f2f',
                            textAlign: 'center'}} 
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

export default Defeat;
