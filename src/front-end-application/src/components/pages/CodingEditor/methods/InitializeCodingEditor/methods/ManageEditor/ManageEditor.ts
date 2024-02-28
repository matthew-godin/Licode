import CodingEditor from "../../../../CodingEditor";

const manageEditor = (that: CodingEditor) => {
    //attach a keydown listener to the left code editor
    document.getElementsByClassName("ace_editor")[0].addEventListener("keydown", that.handleInputKeyDown);
}

export default manageEditor;