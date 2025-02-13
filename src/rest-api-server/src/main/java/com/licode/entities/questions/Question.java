package com.licode.entities.questions;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String input_output_format;

    @Column
    private String question;

    @Column
    private String function_signature;

    @Column
    private String default_custom_input;

    public Question() { }

    public Question(String input_output_format, String question, String function_signature, String default_custom_input) {
        this.input_output_format = input_output_format;
        this.question = question;
        this.function_signature = function_signature;
        this.default_custom_input = default_custom_input;
    }

    public String getInputOutputFormat() {
        return input_output_format;
    }

    public void setInputOutputFormat(String input_output_format) {
        this.input_output_format = input_output_format;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getFunctionSignature() {
        return function_signature;
    }

    public void setFunctionSignature(String function_signature) {
        this.function_signature = function_signature;
    }

    public String getDefaultCustomInput() {
        return default_custom_input;
    }

    public void setDefaultCustomInput(String default_custom_input) {
        this.default_custom_input = default_custom_input;
    }
}
