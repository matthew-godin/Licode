package com.licode.entities.users;

public record MatchedUser(String username, Integer eloRating, String opponentUsername, Integer opponentEloRating) { }
