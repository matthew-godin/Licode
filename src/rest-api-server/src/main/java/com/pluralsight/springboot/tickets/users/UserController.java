package com.pluralsight.springboot.tickets.users;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import java.util.NoSuchElementException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Optional;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private Map<String, String> sids;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.sids = new ConcurrentHashMap<String, String>();
    }

    private AuthUser emptyBody() {
        return new AuthUser(null, null, null, null);
    }

    private DatabaseUser emptyDatabaseUser() {
        return new DatabaseUser(null, null, null, null, null);
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
        return emptyDatabaseUser();
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

    @PostMapping(path = "/api/register")
    public AuthUser register(@RequestBody AuthUser user, HttpServletResponse response) {
        String sid = user.username().value();
        sids.put(sid, user.username().value());
        response.addCookie(new Cookie("sid", sid));
        return user;
    }
}
