package com.pluralsight.springboot.licode.users;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.ProcessBuilder;
import java.lang.Process;
import java.io.BufferedReader;
import java.io.FileReader;
import java.lang.StringBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

public class Run {
    private static void executeCode(CodeSubmission codeSubmission, QuestionInformation questionInformation) {
        try {
            FileWriter codeSubmissionWriter = new FileWriter("./sandbox/answer.py");
            codeSubmissionWriter.write(codeSubmission.value());
            codeSubmissionWriter.close();
            FileWriter answerCustomInputWriter = new FileWriter("./sandbox/answerCustomInput.py");
            answerCustomInputWriter.write(codeSubmission.value());
            answerCustomInputWriter.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        List<String> inputLines = Arrays.asList(codeSubmission.input().split("[\\n]"));
        String customInputContent = "";
        for (int i = 0; i < questionInformation.inputFormat().size(); ++i) {
            if (questionInformation.inputFormat().get(i).equals("n")) {
                customInputContent += Integer.toString(Integer.parseInt(inputLines.get(i))) + "\n";
            } else if (questionInformation.inputFormat().get(i).equals("a")) {
                List<String> inputCommaSeparatedValues = Arrays.asList(inputLines.get(i).split("\\[")[1].split("\\]")[0].split("[,]"));
                customInputContent += Integer.toString(inputCommaSeparatedValues.size()) + "\n";
                for (int j = 0; j < inputCommaSeparatedValues.size(); ++j) {
                    customInputContent += Integer.toString(Integer.parseInt(inputCommaSeparatedValues.get(j))) + "\n";
                }
            } else if (questionInformation.inputFormat().get(i).equals("aa")) {
                List<String> inputCommaSeparatedValues = Arrays.asList(inputLines.get(i).split("(\\[\\[)")[1].split("(\\]\\])")[0].split("(\\],\\[)"));
                customInputContent += Integer.toString(inputCommaSeparatedValues.size()) + "\n";
                for (int k = 0; k < inputCommaSeparatedValues.size(); ++k) {
                    List<String> inputCommaSeparatedValuesSub = Arrays.asList(inputLines.get(k).split("[,]"));
                    customInputContent += Integer.toString(inputCommaSeparatedValuesSub.size()) + "\n";
                    for (int j = 0; j < inputCommaSeparatedValuesSub.size(); ++j) {
                        customInputContent += Integer.toString(Integer.parseInt(inputCommaSeparatedValuesSub.get(k))) + "\n";
                    }
                }
            }
        }
        try {
            FileWriter customInputContentWriter = new FileWriter("./sandbox/customInput.in");
            customInputContentWriter.write(customInputContent);
            customInputContentWriter.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        ProcessBuilder pb = new ProcessBuilder("./makeReport.sh");
        pb.inheritIO();
        pb.directory(new File("./sandbox/" + Integer.toString(questionInformation.questionId())));
        Process process = pb.start();
        process.waitFor();
    }

    private static String readTextFile(String path) {
        String everything = "";
        BufferedReader br = new BufferedReader(new FileReader(path));
        try {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();
            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                line = br.readLine();
            }
            everything = sb.toString();
        } finally {
            br.close();
        }
        return everything;
    }

    private static TestCasesPassed processResults(QuestionInformation questionInformation) {
        String jsonResults = readTextFile("./sandbox/reportFromPySandbox.txt");
        String standardOutputResults = readTextFile("./sandbox/standardOutputFromPySandbox.txt");
        String standardErrorResults = readTextFile("./sandbox/standardErrorFromPySandbox.txt");
        String outputResults = readTextFile("./sandbox/outputFromPySandbox.txt");
        List<String> outputResultsSplit = Arrays.asList(outputResults.split("[\\n]"));
        String actualOutputResults = "";
        if (questionInformation.outputFormat().size() > 0) {
            if (questionInformation.outputFormat().get(0).equals("n")) {
                if (outputResultsSplit.length > 0) {
                    actualOutputResults += outputResultsSplit.get(0);
                }
            } else if (questionInformation.outputFormat().get(0).equals("a")) {
                int n = 0;
                if (outputResultsSplit.size() > 0) {
                    n = Integer.parseInt(outputResultsSplit.get(0));
                }
                if (n > 0 && outputResultsSplit.size() > 1) {
                    actualOutputResults += "[" + outputResultsSplit.get(1);
                }
                for (int i = 1; i < n; ++i) {
                    actualOutputResults += ", " + outputResultsSplit.get(i + 1);
                }
                if (n > 0) {
                    actualOutputResults += "]";
                }
            } else if (questionInformation.outputFormat().get(0).equals("aa")) {
                int n = 0;
                int nn = 0;
                int k = 0;
                if (outputResultsSplit.size() > 0) {
                    n = Integer.parseInt(outputResultsSplit.get(k++));
                }
                if (n > 0) {
                    actualOutputResults += "[[";
                    if (outputResultsSplit.size() > 1) {
                        nn = Integer.parseInt(outputResultsSplit.get(k++));
                    }
                    if (nn > 0 && outputResultsSplit.size() > 2) {
                        actualOutputResults += outputResultsSplit.get(k++);
                    }
                    for (int i = 1; i < nn; ++i) {
                        actualOutputResults += ", " + outputResultsSplit.get(k++);
                    }
                    actualOutputResults += "]";
                }
                for (int i = 1; i < n; ++i) {
                    actualOutputResults += ", [";
                    nn = Integer.parseInt(outputResultsSplit.get(k++));
                    if (nn > 0) {
                        actualOutputResults += outputResultsSplit.get(k++);
                    }
                    for (int j = 1; j < nn; ++j) {
                        actualOutputResults += ", " + outputResultsSplit.get(k++);
                    }
                    actualOutputResults += "]";
                }
                if (n > 0) {
                    actualOutputResults += "]";
                }
            }
        }
        jsonResults = jsonResults.replaceAll("\\s+","");
        jsonResults = jsonResults.substring(0, jsonResults.length() - 2) + "]";
        ObjectMapper mapper = new ObjectMapper();
        List<TestResult> testResults = mapper.readValue(jsonResults, new TypeReference<List<TestResult>>(){});
        Collections.sort(testResults, new TestResultComparator());
        List<Boolean> testResultsPassed = testResults.stream().map(TestResult::passed).collect(Collectors.toList());
        TestCasesPassed testCasesPassed = new TestCasesPassed(testResultsPassed, standardErrorResults, standardErrorResults, actualOutputResults);
        return testCasesPassed;
    };

    public static TestCasesPassed runCode(CodeSubmission codeSubmission, Map<String, List<QuestionInformation>> sidsQuestions, Map<String, Integer> sidsProgress, String sid) {
        QuestionInformation questionInformation = sidsQuestions.get(sid).get(sidsProgress.get(sid));
        executeCode(codeSubmission, questionInformation);
        return processResults(questionInformation);
    }
}