package com.pluralsight.springboot.licode.users;

import jakarta.persistence.*;

public record AuthUser(String text, Email email, Username username, Password password) { }
