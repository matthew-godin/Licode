#!/bin/bash

(cat 2/stub.py) >> answer.py
(cat 2/stubCustomInput.py) >> answerCustomInput.py

containerID=$(docker run -dit py-sandbox)
docker cp 2/TestInputs/ ${containerID}:home/TestEnvironment/TestInputs/
docker cp 2/TestOutputs/ ${containerID}:home/TestEnvironment/TestOutputs/
docker cp answer.py ${containerID}:home/TestEnvironment/answer.py
docker cp customInput.in ${containerID}:home/TestEnvironment/customInput.in
docker cp answerCustomInput.py ${containerID}:home/TestEnvironment/answerCustomInput.py
docker cp 2/clean.py ${containerID}:home/TestEnvironment/clean.py

docker exec ${containerID} sh -c "cd home/TestEnvironment/ && timeout 10 ./makeReport.sh"

docker cp ${containerID}:home/TestEnvironment/report.txt reportFromPySandbox.txt
docker cp ${containerID}:home/TestEnvironment/standardOutput.txt standardOutputFromPySandbox.txt
docker cp ${containerID}:home/TestEnvironment/output.txt outputFromPySandbox.txt

docker kill ${containerID}

docker rm ${containerID}

