import SideEditor from "./SideEditor";

export interface EditorsProps {
    scale: number,
    color: string,
    dataAos: string
}

function Editors(props: EditorsProps) {
    let editorsStyle = {
        display: "flex"
    };
    let marginTop = 1875;
    let marginMiddle = 2625;
    
    let leftUsernameString = "MMM";
    let leftWildcardsVisible = true;
    let leftQuestionString = "XS";
    let leftEditorStrings = [
        "SG",
        "ILS",
        "IXS",
        "ISLSL",
        "IISLS",
        "IIIXS",
        "IIM",
        "IIISXL",
        "IIIILX",
    ];
    let leftEditorLastString = "ISSXS";
    let leftInputString = "L";
    let leftStandardOutputString = "XL";
    let leftStandardErrorString = "XMLXL";
    let leftOutputString = "L";

    let rightUsernameString = "XMS";
    let rightWildcardsVisible = false;
    let rightQuestionString = "XM";
    let rightEditorStrings = [
        "MLLLLLLLL",
        "IMSS",
        "ILM",
        "I",
        "ILLLL",
        "IML",
        "IILM",
        "IIXML",
        "IIXML",
        "IIGG",
        "IIISLSS",
        "IIGX",
        "IISXSS",
        "IIIM",
        "IISS",
        "IIX",
    ];
    let rightEditorLastString = "";
    let rightInputString = "L";
    let rightStandardOutputString = "XL";
    let rightStandardErrorString = "";
    let rightOutputString = "L";

    return (
        <div style={editorsStyle}>
            <SideEditor dataAos={props.dataAos} scale={props.scale} color={props.color} marginTop={marginTop} marginMiddle={marginMiddle}
                usernameString={leftUsernameString} wildcardsVisible={leftWildcardsVisible} questionString={leftQuestionString}
                editorStrings={leftEditorStrings} editorLastString={leftEditorLastString} inputString={leftInputString}
                standardOutputString={leftStandardOutputString} standardErrorString={leftStandardErrorString} outputString={leftOutputString} />
            <SideEditor dataAos={props.dataAos} scale={props.scale} color={props.color} marginTop={marginTop} marginMiddle={marginMiddle}
                usernameString={rightUsernameString} wildcardsVisible={rightWildcardsVisible} questionString={rightQuestionString}
                editorStrings={rightEditorStrings} editorLastString={rightEditorLastString} inputString={rightInputString}
                standardOutputString={rightStandardOutputString} standardErrorString={rightStandardErrorString} outputString={rightOutputString} />
        </div>
    );
}

export default Editors;
