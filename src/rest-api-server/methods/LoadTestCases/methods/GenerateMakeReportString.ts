const generateMakeReportString = (i: number) => {
    return '#!/bin/bash\n\n(cat stub.py) >> ../answer.py\n(cat stubCustomInput.py) >> ../answerCustomInput.py\n\ncontainerID=$(docker run -dit py-sandbox)\ndocker cp TestInputs/ ${containerID}:home/pysandbox/TestEnvironment/TestInputs/\ndocker cp TestOutputs/ ${containerID}:home/pysandbox/TestEnvironment/TestOutputs/\ndocker cp ../answer.py ${containerID}:home/pysandbox/TestEnvironment/answer.py\ndocker cp ../customInput.in ${containerID}:home/pysandbox/TestEnvironment/customInput.in\ndocker cp ../answerCustomInput.py ${containerID}:home/pysandbox/TestEnvironment/answerCustomInput.py\ndocker cp clean.py ${containerID}:home/pysandbox/TestEnvironment/clean.py\ndocker cp cleanOutput.py ${containerID}:home/pysandbox/TestEnvironment/cleanOutput.py\n\ndocker exec ${containerID} sh -c "cd home/pysandbox/TestEnvironment/ && timeout 10 ./makeReport.sh"\n\ndocker cp ${containerID}:home/pysandbox/TestEnvironment/report.txt ../reportFromPySandbox.txt\ndocker cp ${containerID}:home/pysandbox/TestEnvironment/standardOutput.txt ../standardOutputFromPySandbox.txt\ndocker cp ${containerID}:home/pysandbox/TestEnvironment/standardError.txt ../standardErrorFromPySandbox.txt\ndocker cp ${containerID}:home/pysandbox/TestEnvironment/output.txt ../outputFromPySandbox.txt\n\ndocker kill ${containerID}\n\ndocker rm ${containerID}\n\n';
};

export default generateMakeReportString;
