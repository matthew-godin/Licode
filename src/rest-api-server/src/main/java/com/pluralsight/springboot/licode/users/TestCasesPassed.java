package com.pluralsight.springboot.licode.users;

public record TestCasesPassed(List<Boolean> testCasesPassed, String standardOutput, String standardError, String output) { }
