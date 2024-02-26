import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AppBar from "./AppBar";
import Toolbar from "./Toolbar";
import LCButton from "./LicodeButton";
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from '../themes/EditorTheme';

function LicodeAppBar() {
    return (
        <ThemeProvider theme={editorTheme}>
            <div>
                <AppBar position="fixed">
                <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: '#000000' }}>
                    <Box sx={{ flex: 1 }} />
                    <Typography variant="mainTitle" sx={{ color: '#ffffff' }}>
                        licode
                    </Typography>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <LCButton href="/licode/signin" sx={{color: '#ffffff' }}>
                            Sign In
                        </LCButton>
                        <LCButton href="/licode/register" sx={{color: '#ffffff' }}>
                            Sign Up
                        </LCButton>
                    </Box>
                </Toolbar>
                </AppBar>
                <Toolbar />
            </div>
        </ThemeProvider>
    );
}

export default LicodeAppBar;