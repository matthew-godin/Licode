import { useEffect } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';

export interface PillProps {
    width: number,
    height: number,
    scale: number,
    color: string,
    filter: string,
    dataAos: string
}

function Pill(props: PillProps) {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    let width = props.width;
    let height = props.height;
    let borderRadius = 187.5;
    let margin = 187.5;
    let pillStyle = {
        width: width * props.scale + "px",
        height: height * props.scale + "px",
        borderRadius: borderRadius * props.scale + "px",
        backgroundColor: props.color,
        marginLeft: margin * props.scale + "px",
        marginRight: margin * props.scale + "px",
        filter: props.filter
    }

    return (
        <div data-aos={props.dataAos ? props.dataAos : undefined} style={pillStyle} />
    );
}

export default Pill;
