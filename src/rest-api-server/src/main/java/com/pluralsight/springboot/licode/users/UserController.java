package com.pluralsight.springboot.licode.users;

import com.pluralsight.springboot.licode.questions.QuestionRepository;
import com.pluralsight.springboot.licode.questions.Question;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import java.util.NoSuchElementException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;
import java.util.Random;
import java.lang.Math;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.security.NoSuchAlgorithmException;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private Map<String, String> sids;
    private Map<String, Integer> sidsProgress;
    private Map<String, List<QuestionInformation>> sidsQuestions;
    private Map<String, String> matches;
    private Random rand;
    private Logger logger;
    private MatchmakingQueues matchmakingQueues;

    public UserController(UserRepository userRepository, QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.sids = new ConcurrentHashMap<String, String>();
        this.sidsProgress = new ConcurrentHashMap<String, Integer>();
        this.sidsQuestions = new ConcurrentHashMap<String, List<QuestionInformation>>();
        this.matches = new ConcurrentHashMap<String, String>();
        this.matchmakingQueues = new MatchmakingQueues(
            new ArrayList<MatchmakingUser>(),
            new ArrayList<MatchmakingUser>(),
            new ArrayList<MatchmakingUser>(),
            new ArrayList<MatchmakingUser>(),
            new ArrayList<MatchmakingUser>()
        );
        rand = new Random();
        logger = LoggerFactory.getLogger(UserController.class);
    }

    private AuthUser emptyBody() {
        return new AuthUser(null, null, null, null);
    }

    private AuthUser message(String text) {
        return new AuthUser(text, null, null, null);
    }

    private AuthUser user(String email, String username, String password) {
        return new AuthUser(null, new Email(email), new Username(username), new Password(password));
    }

    @GetMapping(path = "/api/user")
    public DatabaseUser user(@CookieValue("sid") String sid) {
        if (sids.containsKey(sid)) {
            User user = userRepository.findByUsername(sids.get(sid))
                .orElseThrow(() -> new NoSuchElementException("User with username " + sids.get(sid) + " not found"));
            return new DatabaseUser(new RecordUser (user.getEmail(), user.getUsername(), user.getNumWins(), user.getNumLosses(), user.getEloRating()));
        }
        return new DatabaseUser(null);
    }

    private String hashPassword(byte[] salt, String password) {
        String hashedPasswordHexString = null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.update(salt);
            byte[] bytes = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for(int i = 0; i < bytes.length; ++i){
                sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }
            hashedPasswordHexString = sb.toString();
        } catch (NoSuchAlgorithmException ex) {
            ex.printStackTrace();
        }
        return hashedPasswordHexString;
    }

    private AuthUser authLogin(AuthUser authUser, User user, HttpServletResponse response) {
        byte[] savedPassword = user.getHashedPassword();
        byte[] providedPassword = hashPassword(user.getSalt(), authUser.password().value()).getBytes(StandardCharsets.UTF_8);
        if (Arrays.equals(savedPassword, providedPassword)) {
            String sid = generateNanoId(40);
            sids.put(sid, user.getUsername());
            response.addCookie(new Cookie("sid", sid));
            return user(user.getEmail(), user.getUsername(), null);
        }
        return message("Wrong Password");
    }

    @PostMapping(path = "/api/login")
    public AuthUser login(@RequestBody AuthUser user, HttpServletResponse response) {
        Optional<User> userByUsername = userRepository.findByUsername(user.email().value());
        if (userByUsername.isPresent()) {
            return authLogin(user, userByUsername.orElse(null), response);
        } else {
            Optional<User> userByEmail = userRepository.findByEmail(user.email().value());
            if (userByEmail.isPresent()) {
                return authLogin(user, userByEmail.orElse(null), response);
            } else {
                return message("Given Email or Username Does Not Exist");
            }
        }
    }

    private char numToNanoIdChar(char num) {
        if (num < 10) {
            return (char)('0' + num);
        } else if (num < 36) {
            return (char)('a' + num - 10);
        } else if (num < 63) {
            return (char)('A' + num - 36);
        } else if (num == 62) {
            return '-';
        } else {
            return '_';
        }
    }

    private String generateNanoId(int size) {
        String nanoId = "";
        for (int i = 0; i < size; ++i) {
            nanoId += numToNanoIdChar((char)rand.nextInt(64));
        }
        return nanoId;
    }

    @PostMapping(path = "/api/register")
    public AuthUser register(@RequestBody AuthUser user, HttpServletResponse response) {
        String validationMessage = Validation.validateUsername(user.username().value(), true);
        if (!validationMessage.isEmpty()) {
            return message(validationMessage);
        }
        validationMessage = Validation.validateEmail(user.email().value(), true);
        if (!validationMessage.isEmpty()) {
            return message(validationMessage);
        }
        validationMessage = Validation.validatePassword(user.password().value(), true);
        if (!validationMessage.isEmpty()) {
            return message(validationMessage);
        }
        Optional<User> userByUsername = userRepository.findByUsername(user.username().value());
        if (userByUsername.isPresent()) {
            return message("Given Username Already Exists");
        } else {
            Optional<User> userByEmail = userRepository.findByEmail(user.email().value());
            if (userByEmail.isPresent()) {
                return message("Given Email Already Exists");
            } else {
                String saltHexString = "";
                for (int i = 0; i < 32; ++i) {
                    saltHexString += Integer.toHexString(rand.nextInt((int)Math.pow(2, 32)));
                }
                int saltHexStringLength = saltHexString.length();
                for (int i = 0; i < 256 - saltHexStringLength; ++i) {
                    saltHexString = "0" + saltHexString;
                }
                byte[] salt = saltHexString.getBytes(StandardCharsets.UTF_8);
                String hashedPasswordHexString = hashPassword(salt, user.password().value());
                userRepository.save(new User(user.email().value(), user.username().value(), 0, 0, 1000, hashedPasswordHexString.getBytes(StandardCharsets.UTF_8), salt, LocalDate.now(), LocalDate.now(), false));
                String sid = generateNanoId(40);
                sids.put(sid, user.username().value());
                response.addCookie(new Cookie("sid", sid));
                return user;
            }
        }
    }

    @GetMapping(path = "/api/logout")
    public AuthUser logout(@CookieValue("sid") String sid, HttpServletResponse response) {
        Cookie cookieToRemove = new Cookie("sid", null);
        cookieToRemove.setMaxAge(0);
        response.addCookie(cookieToRemove);
        sids.remove(sid);
        return message("Successfully Logged Out");
    }

    @GetMapping(path = "/api/matchmaking")
    public MatchedUser matchmaking(@CookieValue("sid") String sid) {
        String username = sids.get(sid);
        int eloRating = userRepository.findByUsername(username).orElse(null).getEloRating();
        MatchmakingUser matchmakingUser = new MatchmakingUser(sid, eloRating);
        ArrayList<ArrayList<MatchmakingUser>> queues = new ArrayList<ArrayList<MatchmakingUser>>();
        queues.add(matchmakingQueues.matchmakingQueue25());
        queues.add(matchmakingQueues.matchmakingQueue50());
        queues.add(matchmakingQueues.matchmakingQueue100());
        queues.add(matchmakingQueues.matchmakingQueue200());
        int[] ranges = new int[]{25, 50, 100, 200};
        int[] delayTimesNums = new int[]{1, 5, 10, 60};
        MatchedUser foundMatch = new MatchedUser(null, null, null, null);
        for (int i = 0; i < queues.size(); ++i) {
            foundMatch = Matchmaking.addToQueue(logger, rand, questionRepository, sids, sidsProgress, sidsQuestions, matches, queues.get(i), matchmakingUser, ranges[i]);
            if (foundMatch.username() != null) {
                break;
            } else {
                for (int j = 0; j < delayTimesNums[i]; ++j) {
                    foundMatch = Matchmaking.checkIfFoundInQueue(userRepository, sids, matches, 1, matchmakingUser, username);
                    if (foundMatch.username() != null) {
                        break;
                    }
                }
                if (foundMatch.username() != null) {
                    break;
                }
                Matchmaking.removeFromQueue(queues.get(i), sid);
            }
        }
        if (foundMatch.username() == null) {
            foundMatch = Matchmaking.addToQueue(logger, rand, questionRepository, sids, sidsProgress, sidsQuestions, matches, matchmakingQueues.matchmakingQueue500(), matchmakingUser, 500);
            if (foundMatch.username() == null) {
                for (;;) {
                    foundMatch = Matchmaking.checkIfFoundInQueue(userRepository, sids, matches, 1, matchmakingUser, username);
                    if (foundMatch.username() != null) {
                        break;
                    }
                }
            }
        }
        return foundMatch;
    }

    @GetMapping(path = "/api/opponent")
    public Opponent opponent(@CookieValue("sid") String sid) {
        String username = sids.get(sid);
        String opponentUsername = sids.get(matches.get(sid));
        if (username != null && opponentUsername != null) {
            int eloRating = userRepository.findByUsername(username).orElse(null).getEloRating();
            int opponentEloRating = userRepository.findByUsername(opponentUsername).orElse(null).getEloRating();
            return new Opponent(new OpponentUser(username, eloRating, sid), new OpponentUser(opponentUsername, eloRating, ""));
        }
        return new Opponent(null, null);
    }

    @GetMapping(path = "/api/question")
    public MatchQuestion question(@CookieValue("sid") String sid) {
        Question q = questionRepository.findById(sidsQuestions.get(sid).get(sidsProgress.get(sid)).questionId()).orElse(null);
        return new MatchQuestion(q.getQuestion(), q.getFunctionSignature(), q.getDefaultCustomInput());
    }

    @PostMapping(path = "/api/run")
    public TestCasesPassed run(@CookieValue("sid") String sid, @RequestBody CodeSubmission codeSubmission) {
        TestCasesPassed testCasesPassed = Run.runCode(codeSubmission, sidsQuestions, sidsProgress, sid);
        if (!testCasesPassed.testCasesPassed().contains(false)) {
            sidsProgress.put(sid, sidsProgress.get(sid) + 1);
            if (sidsProgress.get(sid).equals(3)) {
                Win.win(userRepository, sids, sidsQuestions, sidsProgress, matches, sid);
            }
        }
        return testCasesPassed;
    }
}
