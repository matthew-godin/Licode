package com.licode.comparators;

import com.licode.entities.users.TestResult;

import java.util.Comparator;

public class TestResultComparator implements Comparator<TestResult> {
    @Override
    public int compare(TestResult t1, TestResult t2) {
        return t1.testName().replaceAll("test", "").compareTo(t2.testName().replaceAll("test", ""));
    }
}
