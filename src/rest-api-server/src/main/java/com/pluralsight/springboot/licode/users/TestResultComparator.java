package com.pluralsight.springboot.licode.users;

import java.util.Comparator;

public class TestResultComparator implements Comparator<TestResult> {
    @Override
    public int compare(TestResult t1, TestResult t2) {
        return (t1.testName().replaceAll("test", "")) - (t2.testName().replaceAll("test", ""));
    }
}
