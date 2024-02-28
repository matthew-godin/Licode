import CodingEditor from "../../CodingEditor";

export const won = (that: CodingEditor): boolean => {
    const testsPassed: number = that.state.testCasesPassed.reduce((numPassed: number, passed: boolean) => {
        if (passed) {
            return numPassed + 1;
        } else {
            return numPassed;
        }
    }, 0);
    return testsPassed == 11;
}