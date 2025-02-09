package com.pluralsight.springboot.tickets.users;

import jakarta.persistence.*;

public record FoundUser(Email email, Username username) { }
