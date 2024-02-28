import * as React from "react";
import { Typography } from '@mui/material';

export interface QuestionLineProps {
    question: string,
}

function QuestionLine(props: QuestionLineProps) {
    let questionSplits = props.question.split('$');
    let highlight: boolean = true;
    let typographies = [];
    if (questionSplits.length > 0) {
        typographies.push(React.createElement(Typography, { variant: 'problemDescription' }, questionSplits[0]));
    }
    for (let i = 1; i < questionSplits.length; ++i) {
        if (highlight) {
            typographies.push(React.createElement(Typography, { variant: 'problemHighlightedWord' }, '\u00A0' + questionSplits[i]));
        } else {
            typographies.push(React.createElement(Typography, { variant: 'problemDescription' }, '\u00A0' + questionSplits[i]));
        }
        highlight = !highlight;
    }
    return React.createElement('div', {}, ...typographies);
}

export default QuestionLine;
