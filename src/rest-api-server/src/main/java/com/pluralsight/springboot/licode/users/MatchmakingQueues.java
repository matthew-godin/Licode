package com.pluralsight.springboot.licode.users;

import java.util.List;

public record MatchmakingQueues(
    List<MatchmakingUser> matchmakingQueue25,
    List<MatchmakingUser> matchmakingQueue50,
    List<MatchmakingUser> matchmakingQueue100,
    List<MatchmakingUser> matchmakingQueue200,
    List<MatchmakingUser> matchmakingQueue500) { }
