import * as React from "react";
import { Box, Button, Stack, Paper } from "@mui/material";
import VictoryProps from "./VicotryProps";
import { VictoryState } from "./VictoryState";

const styles = {
    paperContainer: {
        backgroundColor: '#fdc332',
        backgroundPosition: "center",
        backgroundSize: "cover",
        border:"0px"
    }
};

class Victory extends React.Component<VictoryProps, VictoryState>{

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
                        sx={{
                            bgcolor:'background.paper',
                            fontFamily: 'Varela Round',
                            fontSize: 92, border:5, p:2,
                            borderColor: '#f09d03',
                            textAlign: 'center'
                        }} 
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

export default Victory;
