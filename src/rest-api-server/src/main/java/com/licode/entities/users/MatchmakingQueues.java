package com.licode.entities.users;

import java.util.ArrayList;

public record MatchmakingQueues(
    ArrayList<MatchmakingUser> matchmakingQueue25,
    ArrayList<MatchmakingUser> matchmakingQueue50,
    ArrayList<MatchmakingUser> matchmakingQueue100,
    ArrayList<MatchmakingUser> matchmakingQueue200,
    ArrayList<MatchmakingUser> matchmakingQueue500) { }
