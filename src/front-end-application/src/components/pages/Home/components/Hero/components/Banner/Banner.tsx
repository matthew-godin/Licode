import { useLayoutEffect, useState } from "react";
import Editors from "./components/Editors";
import QuestionStatement from "./components/QuestionStatement";

export interface BannerProps {
    color: string,
    dataAos: string
}

function Banner(props: BannerProps) {
    const [width, setWidth] = useState<number>(window.innerWidth);
    useLayoutEffect(() => {
        function updateSize() {
          setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
      }, []);
    let bannerStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };
    let scale = width / 140000;
    if (width < 900) {
        scale *= 2;
    }

    return (
        <div style={bannerStyle}>
            <div>
                <div style={{height: 10000 * scale + "px"}} />
                <QuestionStatement dataAos={props.dataAos} scale={scale} color={props.color} />
                <Editors dataAos={props.dataAos} scale={scale} color={props.color} />
            </div>
        </div>
    );
}

export default Banner;