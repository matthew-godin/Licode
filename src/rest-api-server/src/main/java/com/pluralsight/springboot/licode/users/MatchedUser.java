package com.pluralsight.springboot.licode.users;

public record MatchedUser(String username, Integer eloRating, String opponentUsername, Integer opponentEloRating) { }
