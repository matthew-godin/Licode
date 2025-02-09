package com.pluralsight.springboot.tickets.users;

import jakarta.persistence.*;

public record AuthUser(String text = null, Email email = null, Username username = null, Password password = null) { }
