package com.pluralsight.springboot.licode.users;

import java.util.List;

public record QuestionInformation(Long questionId, List<String> inputFormat, List<String> outputFormat) { }
