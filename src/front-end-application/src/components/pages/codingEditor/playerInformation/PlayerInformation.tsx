import { Typography } from '@mui/material';

export interface PlayerInformationProps {
    username: string,
    eloRating: number,
    loaded: boolean,
}

function PlayerInformation(props: PlayerInformationProps) {
    const loaded: boolean = props.loaded;
    if (loaded) {
        return <Typography variant="aboveEditor" sx={{ m: 0, p: 0 }}>{props.username}: Rank {props.eloRating}</Typography>;
    } else {
        return <Typography variant="aboveEditor" sx={{ m: 0, p: 0, display: "none" }} />;
    }
}

export default PlayerInformation;
