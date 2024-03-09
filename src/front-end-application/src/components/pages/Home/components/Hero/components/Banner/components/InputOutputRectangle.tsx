import { useEffect } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';

export interface InputOutputRectangleProps {
    scale: number,
    color: string,
    dataAos: string
}

function InputOutputRectangle(props: InputOutputRectangleProps) {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    let height = 2625;
    let width = height * 8;
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

export default InputOutputRectangle;
