package com.pluralsight.springboot.licode.users;

import java.lang.Math;
import java.util.List;
import java.util.Map;

public class Win {
    public static void win(UserRepository userRepository, Map<String, String> sids, Map<String, List<QuestionInformation>> sidsQuestions, Map<String, Integer> sidsProgress, Map<String, String> matches, String sid) {
        String opponentSid = matches.get(sid);
        matches.remove(sid);
        matches.remove(opponentSid);
        sidsProgress.remove(sid);
        sidsProgress.remove(opponentSid);
        sidsQuestions.remove(sid);
        sidsQuestions.remove(opponentSid);
        User user = userRepository.findByUsername(sids.get(sid)).orElse(null);
        User opponent = userRepository.findByUsername(sids.get(opponentSid)).orElse(null);
        user.setNumWins(user.getNumWins() + 1);
        double eloRatingVariation = 1 - 1.0 / (1 + Math.pow(10, (opponentEloRating - eloRating) / 400.0));
        user.setEloRating(user.getEloRating() + Math.floor((user.getNumGames() < 30 ? (user.getEloRating() < 2300 ? 40 : 20) : (user.getHas2400RatingHistory() ? 10 : 20)) * eloRatingVariation));
        opponent.setNumLosses(opponent.getNumLosses() + 1);
        opponent.setEloRating(opponent.getEloRating() - Math.ceil((opponentNumGames < 30 ? (opponentEloRating < 2300 ? 40 : 20) : (opponentHas2400RatingHistory ? 10 : 20)) * eloRatingVariation));
        userRepository.save(user);
        userRepository.save(opponent);
    }
}