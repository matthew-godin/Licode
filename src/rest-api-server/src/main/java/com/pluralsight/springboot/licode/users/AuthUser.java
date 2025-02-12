package com.pluralsight.springboot.licode.users;

public record AuthUser(String text, Email email, Username username, Password password) { }
