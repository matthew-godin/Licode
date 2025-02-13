package com.licode.entities.users;

import java.util.List;

public record QuestionInformation(Long questionId, List<String> inputFormat, List<String> outputFormat) { }
