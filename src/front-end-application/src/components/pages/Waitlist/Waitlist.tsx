import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import LoadingRing from '../../common/LoadingRing';

const Waitlist = () => {
    const navigate = useNavigate();
    useEffect(() => {
        fetch('/api/matchmaking').then(response => response.json()).then((json) => { navigate('/editor'); });
    }, []);
    return (
        <Box
            height="100vh"
            sx={{ backgroundColor: '#01182a', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
            display="flex" 
            flexDirection="column"
        >
            <Typography sx={{ fontSize: 56, color: 'white', textAlign: 'center', marginTop: '40vh' }}>
                Waiting to be matched with another player . . . 
            </Typography>
            <Typography sx={{textAlign: 'center', marginTop: '3vh'}}>
                <LoadingRing />
            </Typography>
        </Box>
    );
}

export default Waitlist;
