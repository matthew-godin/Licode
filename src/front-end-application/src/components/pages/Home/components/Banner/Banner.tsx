import Editors from "./components/Editors";
import QuestionStatement from "./components/QuestionStatement";

function Banner() {
    let bannerStyle = {
        margin: "100px"
    };
    let scale = 0.02;
    let color = "black";

    return (
        <div style={bannerStyle}>
            <QuestionStatement scale={scale} color={color} />
            <Editors scale={scale} color={color} />
        </div>
    );
}

export default Banner;