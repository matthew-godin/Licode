package com.licode.util;

import com.licode.entities.users.*;
import com.licode.entities.questions.*;
import com.licode.repositories.*;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.lang.Math;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Random;
import java.util.Collections;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import java.net.MalformedURLException;
import java.io.IOException;
import java.net.ProtocolException;
import java.lang.InterruptedException;

public class Matchmaking {
    private static final int NUM_QUESTIONS_PER_MATCH = 3;

    private static void selectQuestions(QuestionRepository questionRepository, Random rand, Map<String, List<QuestionInformation>> sidsQuestions,
        Map<String, String> matches, MatchmakingUser matchmakingUser) {
        Long numQuestions = questionRepository.count();
        List<Long> questionsSelected = new ArrayList<Long>();
        List<Long> randomPermutation = new ArrayList<Long>();
        for (Long i = 0L; i < numQuestions; ++i) {
            randomPermutation.add(i);
        }
        // Partial Fisher-Yates Algorithm for random selection of questions
        for (Long i = 0L; i < NUM_QUESTIONS_PER_MATCH; ++i) {
            Long j = rand.nextLong(numQuestions);
            Collections.swap(randomPermutation, i.intValue(), j.intValue());
        }
        for (Long i = 0L; i < NUM_QUESTIONS_PER_MATCH; ++i) {
            questionsSelected.add(randomPermutation.get(i.intValue()) + 1L);
        }
        List<QuestionInformation> questionsInformation = new ArrayList<QuestionInformation>();
        for (Long i = 0L; i < questionsSelected.size(); ++i) {
            String inputOutputFormat = questionRepository.findById(questionsSelected.get(i.intValue())).orElse(null).getInputOutputFormat();
            List<String> inputOutputFormats = Arrays.asList(inputOutputFormat.split("[|]"));
            List<String> inputFormat = Arrays.asList(inputOutputFormats.get(0).split("[;]"));
            inputFormat.remove(0);
            List<String> outputFormat = Arrays.asList(inputOutputFormats.get(1).split("[;]"));
            outputFormat.remove(0);
            QuestionInformation questionInformation = new QuestionInformation(questionsSelected.get(i.intValue()), inputFormat, outputFormat);
            questionsInformation.add(questionInformation);
        }
        sidsQuestions.put(matchmakingUser.sid(), questionsInformation);
        sidsQuestions.put(matches.get(matchmakingUser.sid()), questionsInformation);
    }

    public static MatchedUser addToQueue(Logger logger, Random rand, QuestionRepository questionRepository,
        Map<String, String> sids, Map<String, Integer> sidsProgress, Map<String, List<QuestionInformation>> sidsQuestions,
        Map<String, String> matches, List<MatchmakingUser> queue, MatchmakingUser matchmakingUser, int range) {
        queue.add(matchmakingUser);
        for (int i = 0; i < queue.size(); ++i) {
            if (queue.get(i).sid() != matchmakingUser.sid()
                && Math.abs(matchmakingUser.eloRating() - queue.get(i).eloRating()) <= range) {
                matches.put(queue.get(i).sid(), matchmakingUser.sid());
                matches.put(matchmakingUser.sid(), queue.get(i).sid());
                sidsProgress.put(queue.get(i).sid(), 0);
                sidsProgress.put(matchmakingUser.sid(), 0);
                //can call goServer/registerPair here
                logger.info("attempting register pair " + matchmakingUser.sid() + ", " + queue.get(i).sid());
                URL registerPairURL = null;
                HttpURLConnection registerPairConnection = null;
                try {
                    registerPairURL = new URL("https://matthew-godin.com/registerPair");
                } catch (MalformedURLException ex) {
                    ex.printStackTrace();
                }
                try {
                    registerPairConnection = (HttpURLConnection)registerPairURL.openConnection();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
                try {
                    registerPairConnection.setRequestMethod("POST");
                } catch (ProtocolException ex) {
                    ex.printStackTrace();
                }
                //registerPairConnection.setRequestProperty("User-Agent", "Mozilla/5.0");
                registerPairConnection.setRequestProperty("Content-Type", "application/json");
                //registerPairConnection.setRequestProperty("Accept", "application/json");
                registerPairConnection.setDoOutput(true);
                String registerPairJson = "{\"Id1\": \"" + matchmakingUser.sid() + "\", \"Id2\": \"" + queue.get(i).sid() + "\"}";
                try (OutputStream registerPairOutputStream = registerPairConnection.getOutputStream()) {
                    byte[] registerPairInput = registerPairJson.getBytes("utf-8");
                    registerPairOutputStream.write(registerPairInput, 0, registerPairInput.length);
                    registerPairOutputStream.flush();
                    registerPairOutputStream.close();
                    int registerPairResponseCode = registerPairConnection.getResponseCode();
                    logger.info("registerPair response: " + registerPairResponseCode);
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
                //can probably eliminate this, main purpose of this api
                //method is to match users and register them with the go server
                queue.remove(i);
                queue.remove(queue.size() - 1);
                selectQuestions(questionRepository, rand, sidsQuestions, matches, matchmakingUser);
                return new MatchedUser(sids.get(matchmakingUser.sid()), matchmakingUser.eloRating(), sids.get(queue.get(i).sid()), queue.get(i).eloRating());
            }
        }
        return new MatchedUser(null, null, null, null);
    }

    public static MatchedUser checkIfFoundInQueue(UserRepository userRepository, Map<String, String> sids, Map<String, String> matches,
        int delayTime, MatchmakingUser matchmakingUser, String username) {
        try {
            TimeUnit.SECONDS.sleep(delayTime);
        } catch (InterruptedException ex) {
            ex.printStackTrace();
        }
        if (matches.get(matchmakingUser.sid()) != null) {
            String opponentUsername = sids.get(matches.get(matchmakingUser.sid()));
            int opponentEloRating = userRepository.findByUsername(username).orElse(null).getEloRating();
            return new MatchedUser(sids.get(matchmakingUser.sid()), matchmakingUser.eloRating(), opponentUsername, opponentEloRating);
        }
        return new MatchedUser(null, null, null, null);
    };

    public static void removeFromQueue(List<MatchmakingUser> queue, String sid) {
        for (int i = 0; i < queue.size(); ++i) {
            if (queue.get(i).sid().equals(sid)) {
                queue.remove(i);
            }
        }
    }
}