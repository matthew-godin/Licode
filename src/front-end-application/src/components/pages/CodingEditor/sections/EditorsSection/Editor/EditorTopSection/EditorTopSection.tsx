import { Grid, IconButton, Typography } from '@mui/material';
import PlayerInformation from './PlayerInformation/PlayerInformation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditorTopSectionProps from './EditorTopSectionProps';

function EditorTopSection(props: EditorTopSectionProps) {
    return (
        <Grid container item mt={2}>
            <Grid item xs={0.5} />
            <Grid container direction="column" item xs={11}>
                <Grid item>
                    <PlayerInformation loaded={props.loaded} username={props.topSectionData.username}
                        eloRating={props.topSectionData.eloRating} />
                </Grid>
                <Grid container sx={{ visibility: props.isPlayer ? 'visible' : 'hidden' }}>
                    <Grid item xs="auto">
                        <IconButton color="button" onClick={props.webSocketServerMethods.skipTestCase}>
                            <CheckCircleIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                    </Grid>
                    <Grid item xs="auto">
                        <IconButton color="button" onClick={props.webSocketServerMethods.slowOpponent}>
                            <SpeedIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                    </Grid>
                    <Grid item xs="auto">
                        <IconButton color="button" onClick={props.webSocketServerMethods.peekOpponent}>
                            <RemoveRedEyeIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography variant="aboveEditor" sx={{ m: 0, p: 0 }}>
                        Question {props.topSectionData.questionNum}/3
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={0.5} />
        </Grid>
    );
}

export default EditorTopSection;