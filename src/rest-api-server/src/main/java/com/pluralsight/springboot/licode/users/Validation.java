package com.pluralsight.springboot.licode.users;

import java.util.regex.Pattern;

public class Validation {
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MIN_USERNAME_LENGTH = 4;
    private static final int MIN_EMAIL_LENGTH = 3;
    private static final int MAX_PASSWORD_LENGTH = 256;
    private static final int MAX_USERNAME_LENGTH = 16;
    private static final int MAX_EMAIL_LENGTH = 320;
    private static final String INVALID_EMAIL_MESSAGE = "Email Address must be valid";

    public static String validatePassword(String password, boolean annoying) {
        if (!annoying && password.length() == 0) {
            //don't want to annoy the user, they know an empty password is invalid
            return "";
        } else if (password.length() < MIN_PASSWORD_LENGTH) {
            return "Password must be at least " + MIN_PASSWORD_LENGTH + " characters";
        } else if (password.length() > MAX_PASSWORD_LENGTH) {
            return "Password must be at most " + MAX_PASSWORD_LENGTH + " characters";
        } else {
            //must meet NUM_PASSWORD_SOFT_REQS of 2 requirements
            boolean hasLower = Pattern.compile("[a-z]").matcher(password).find();
            boolean hasUpper = Pattern.compile("[A-Z]").matcher(password).find();
            boolean hasDigit = Pattern.compile("\\d").matcher(password).find();
            boolean hasSpecial = Pattern.compile("[^a-zA-Z\\d]").matcher(password).find();
            boolean softReqsMet = 0;
            if (hasLower) softReqsMet++;
            if (hasUpper) softReqsMet++;
            if (hasDigit) softReqsMet++;
            if (hasSpecial) softReqsMet++;
            if (softReqsMet < NUM_PASSWORD_SOFT_REQS) {
                return "Password must have at least ${NUM_PASSWORD_SOFT_REQS} of the following:\n"
                + "at least 1 lower case letter\n"
                + "at least 1 upper case letter\n"
                + "at least 1 number\n"
                + "at least 1 special character.";
            } else {
                return "";
            }
        }
    }   

    public static String validateUsername(String username, boolean annoying) {
        if (!annoying && username.length == 0) {
            //don't want to annoy the user, they know an empty password is invalid
            return "";
        } else if (username.length() < MIN_USERNAME_LENGTH) {
            return "Username must be at least " + MIN_USERNAME_LENGTH + " characters";
        } else if (username.length() > MAX_USERNAME_LENGTH) {
            return "Username must be at most " + MAX_USERNAME_LENGTH + " characters";
        } else {
            if (Pattern.compile("^.*[-]{2}.*$").matcher(username).find() || Pattern.compile("^.*[.]{2}.*$").matcher(username).find() || Pattern.compile("^.*[_]{2}.*$").matcher(username).find()) {
                return "Username must not contain consecutive dashes, periods, or underscores";
            } else {
                return "";
            }
        }
    }

    public static String validateEmail(String email, boolean annoying) {
        String emailLowerCase = email.toLowerCase();
        String[] atSplit = emailLowerCase.split("[@]");
        if (atSplit.length != 2) {
            return INVALID_EMAIL_MESSAGE;
        }
        String prefix = atSplit[0];
        String domain = atSplit[1];
        if (prefix.length() < 1 || prefix.length() > 64 || domain.length() > 255) {
            return INVALID_EMAIL_MESSAGE;
        }
        if (Pattern.compile("[^a-z\\d-_.]").matcher(prefix).find() || prefix.charAt(0) == '-' || prefix.charAt(0) == '_' || prefix.charAt(0) == '.'
            || prefix.charAt(prefix.length() - 1) == '-' || prefix.charAt(prefix.length - 1) == '_' || prefix.charAt(prefix.length - 1) == '.'
            || Pattern.compile("^.*[-]{2}.*$").matcher(prefix).find() || Pattern.compile("^.*[.]{2}.*$").matcher(prefix).find() || Pattern.compile("^.*[_]{2}.*$").matcher(prefix).find()) {
            return INVALID_EMAIL_MESSAGE;
        }
        String[] dotSplit = domain.split("[.]");
        if (dotSplit.length() < 2) {
            return INVALID_EMAIL_MESSAGE;
        }
        for (int i = 0; i < dotSplit.length - 1; ++i) {
            if (dotSplit[i].length() < 1 || dotSplit[i].length() > 63) {
                return INVALID_EMAIL_MESSAGE;
            }
            if (Pattern.compile("[^a-z\\d-]").matcher(dotSplit[i]).find()) {
                return INVALID_EMAIL_MESSAGE;
            }
        }
        if (!(AllowedDomainExtensions.isAllowedDomainExtension(dotSplit[dotSplit.length - 1]))) {
            return INVALID_EMAIL_MESSAGE;
        }

        return "";
    }
}