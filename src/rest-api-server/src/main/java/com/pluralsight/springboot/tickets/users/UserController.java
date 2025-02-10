package com.pluralsight.springboot.tickets.users;

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

@RestController
public class UserController {

    private final UserRepository userRepository;
    private Map<String, String> sids;
    private Random rand;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.sids = new ConcurrentHashMap<String, String>();
        rand = new Random();
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

    @PostMapping(path = "/api/login")
    public AuthUser login(@RequestBody AuthUser user) {
        Optional<User> userByUsername = userRepository.findByUsername(user.email().value());
        if (userByUsername.isPresent()) {
            return message("PRESENT");
        } else {
            Optional<User> userByEmail = userRepository.findByEmail(user.email().value());
            if (userByEmail.isPresent()) {
                return message("PRESENT");
            } else {
                //return new Message("Given Email or Username Does Not Exist");
                return message("NOT PRESENT");
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
                    saltHexString += Integer.toHexString(rand.nextInt(Math.pow(2, 32)));
                }
                int saltHexStringLength = saltHexString.length();
                for (int i = 0; i < 256 - saltHexStringLength; ++i) {
                    saltHexString = "0" + saltHexString;
                }
                MessageDigest md = MessageDigest.getInstance("SHA-512");
                md.update(salt.getBytes(StandardCharsets.UTF_8));
                byte[] bytes = md.digest(passwordToHash.getBytes(StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder();
                for(int i = 0; i < bytes.length; ++i){
                    sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
                }
                String hashedPasswordHexString = sb.toString();
                userRepository.save(new User(user.email().value(), user.username().value(), 0, 0, 1000, hashedPasswordHexString, saltHexString, LocalDate.now(), LocalDate.now(), false));
                String sid = generateNanoId(40);
                sids.put(sid, user.username().value());
                response.addCookie(new Cookie("sid", sid));
                return user;
            }
        }
    }
}
