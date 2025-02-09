package com.pluralsight.springboot.tickets.users;

import jakarta.persistence.*;

public record AuthUser(String text, Email email, Username username, Password password) { }
