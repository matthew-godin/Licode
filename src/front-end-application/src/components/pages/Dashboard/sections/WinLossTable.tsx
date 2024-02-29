import { Table, Paper, TableContainer, TableBody, TableRow, TableCell } from "@mui/material";

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

export interface WinLossProps {
    numWins?: number,
    numLosses?: number,
    eloRating?: number
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
                        <TableCell sx={{fontSize: 24}}>Win Rate: </TableCell>
                        <TableCell sx={{fontSize: 24}}>{computeWinRate(props.numWins, props.numLosses)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default WinLossTable;
