package com.pluralsight.springboot.licode.users;

import java.util.List;
import java.util.Map;

public record TestCasesPassed(List<Boolean> testCasesPassed, String standardOutput, String standardError, String output) { }
