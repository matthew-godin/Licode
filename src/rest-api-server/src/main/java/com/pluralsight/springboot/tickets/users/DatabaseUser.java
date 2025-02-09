package com.pluralsight.springboot.tickets.users;

import jakarta.persistence.*;

public record DatabaseUser(String email, String username, Integer numWins, Integer numLosses, Integer eloRating, boolean loading) { }
