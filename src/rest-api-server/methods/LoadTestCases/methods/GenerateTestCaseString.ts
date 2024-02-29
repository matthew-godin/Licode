const generateTestCaseString = (allTestCases: string[], format: string[], j: number): string => {
    let testCaseString = '';
    let testCase = allTestCases[j].split(';');
    let k = 0;
    let m = 0;
    let mMax = 0;
    let n = 0;
    let nMax = 0;
    let insideArray = false;
    let insideArrayArray = false;
    for (let l = 0; l < testCase.length; ++l) {
        if (format[k] == 'n') {
            testCaseString += testCase[l] + '\n';
            ++k;
        } else if (format[k] == 'a') {
            if (insideArray) {
                if (m < mMax) {
                    testCaseString += testCase[l] + '\n';
                    ++m;
                } else {
                    insideArray = false;
                    ++k;
                    --l;
                }
            } else {
                testCaseString += testCase[l] + '\n';
                m = 0;
                mMax = parseInt(testCase[l]);
                insideArray = true;
            }
        } else if (format[k] == 'aa') {
            if (insideArray) {
                if (m < mMax) {
                    if (insideArrayArray) {
                        if (n < nMax) {
                            testCaseString += testCase[l] + '\n';
                            ++n;
                        } else {
                            insideArrayArray = false;
                            ++m;
                            --l;
                        }
                    } else {
                        testCaseString += testCase[l] + '\n';
                        n = 0;
                        nMax = parseInt(testCase[l]);
                        insideArrayArray = true;
                    }
                } else {
                    insideArray = false;
                    ++k;
                    --l;
                }
            } else {
                testCaseString += testCase[l] + '\n';
                m = 0;
                mMax = parseInt(testCase[l]);
                insideArray = true;
            }
        }
    }
    return testCaseString;
}

export default generateTestCaseString;
