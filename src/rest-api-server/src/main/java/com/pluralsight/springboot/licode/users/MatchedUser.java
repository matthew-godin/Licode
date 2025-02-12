package com.pluralsight.springboot.licode.users;

public record MatchedUser(String username, int eloRating, String opponentUsername, int opponentEloRating) { }
