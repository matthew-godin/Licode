import EditorData from "../../interfaces/EditorData";
import TopSectionData from "../../interfaces/TopSectionData";
import EditorSectionData from "../../interfaces/EditorSectionData";
import InputOutputSectionData from "../../interfaces/InputOutputSectionData";
import WebSocketServerMethods from "../../interfaces/WebSocketServerMethods";
import EditorFlags from "../../interfaces/EditorFlags";
import CodingEditorData from "../../interfaces/CodingEditorData";
import CodingEditor from "../../CodingEditor";

const createCodingEditorData = (that: CodingEditor): CodingEditorData => {
    let userTopSectionData: TopSectionData = {
        username: that.state.username,
        eloRating: that.state.eloRating,
        questionNum: that.state.questionNum
    };
    let userEditorSectionData: EditorSectionData = {
        code: that.state.code,
        handleCodeChange: that.handleCodeChange
    };
    let userInputData: InputOutputSectionData = {
        content: that.state.input,
        handleChange: that.handleInputChange
    };
    let userStandardOutputData: InputOutputSectionData = {
        content: that.state.standardOutput,
        errorContent: that.state.standardError,
        handleChange: () => {}
    };
    let userOutputData: InputOutputSectionData = {
        content: that.state.output,
        handleChange: () => {}
    };
    let userEditorData: EditorData = {
        topSectionData: userTopSectionData,
        editorSectionData: userEditorSectionData,
        inputData: userInputData,
        standardOutputData: userStandardOutputData,
        outputData: userOutputData,
        testCasesPassed: that.state.testCasesPassed
    }
    let opponentTopSectionData: TopSectionData = {
        username: that.state.opponentUsername,
        eloRating: that.state.opponentEloRating,
        questionNum: that.state.opponentQuestionNum
    };
    let opponentEditorSectionData: EditorSectionData = {
        code: that.state.rightEditorCode,
        handleCodeChange: that.handleCodeChange
    };
    let opponentInputData: InputOutputSectionData = {
        content: that.state.rightInput,
        handleChange: that.handleInputChange
    };
    let opponentStandardOutputData: InputOutputSectionData = {
        content: that.state.rightStandardOutput,
        errorContent: that.state.rightStandardError,
        handleChange: () => {}
    };
    let opponentOutputData: InputOutputSectionData = {
        content: that.state.rightOutput,
        handleChange: () => {}
    };
    let opponentEditorData: EditorData = {
        topSectionData: opponentTopSectionData,
        editorSectionData: opponentEditorSectionData,
        inputData: opponentInputData,
        standardOutputData: opponentStandardOutputData,
        outputData: opponentOutputData,
        testCasesPassed: that.state.rightTestCasesPassed
    }
    let webSocketServerMethods: WebSocketServerMethods = {
        skipTestCase: that.skipTestCase,
        slowOpponent: that.slowOpponent,
        peekOpponent: that.peekOpponent
    };
    let editorFlags: EditorFlags = {
        loaded: that.state.loaded,
        peeking: that.state.peeking
    };
    let codingEditorData: CodingEditorData = {
        userEditorData: userEditorData,
        opponentEditorData: opponentEditorData,
        webSocketServerMethods: webSocketServerMethods,
        editorFlags: editorFlags
    };
    return codingEditorData;
};

export default createCodingEditorData;
