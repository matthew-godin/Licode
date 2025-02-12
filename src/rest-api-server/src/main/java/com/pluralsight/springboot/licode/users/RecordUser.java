package com.pluralsight.springboot.licode.users;

public record RecordUser(String email, String username, Integer numWins, Integer numLosses, Integer eloRating) { }
