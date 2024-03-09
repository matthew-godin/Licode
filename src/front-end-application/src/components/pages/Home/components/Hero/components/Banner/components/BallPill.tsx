import { useEffect } from "react";
import AOS from "aos";
import 'aos/dist/aos.css';

export interface BallPillProps {
    scale: number,
    color: string,
    filter: string,
    dataAos: string
}

function BallPill(props: BallPillProps) {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    let width = 1125;
    let height = width / 1.5;
    let borderRadius = width / 2;
    let margin = 375;
    let marginTop = (width - height) / 2;
    let ballStyle = {
        width: width * props.scale + "px",
        height: height * props.scale + "px",
        borderRadius: borderRadius * props.scale + "px",
        backgroundColor: props.color,
        marginLeft: margin * props.scale + "px",
        marginRight: margin * props.scale + "px",
        marginTop : marginTop * props.scale + "px",
        filter: props.filter
    }

    return (
        <div data-aos={props.dataAos ? props.dataAos : undefined} style={ballStyle} />
    );
}

export default BallPill;
