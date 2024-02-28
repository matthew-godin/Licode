export default interface User {
    email?: string;
    username?: string;
    numWins?: number;
    numLosses?: number;
    eloRating?: number;
    loading?: boolean;
}
