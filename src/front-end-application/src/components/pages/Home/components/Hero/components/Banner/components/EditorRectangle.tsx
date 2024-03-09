import { useEffect } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';

export interface EditorRectangleProps {
    scale: number,
    color: string,
    dataAos: string
}

function EditorRectangle(props: EditorRectangleProps) {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    let width = 1875;
    let height = width * 8;
    let borderRadius = 375;
    let margin = 375;
    let editorRectangleStyle = {
        width: width * props.scale + "px",
        height: height * props.scale + "px",
        borderRadius: borderRadius * props.scale + "px",
        backgroundColor: props.color,
        marginLeft: margin * props.scale + "px",
        marginRight: margin * props.scale + "px"
    }

    return (
        <div data-aos={props.dataAos ? props.dataAos : undefined} style={editorRectangleStyle} />
    );
}

export default EditorRectangle;
