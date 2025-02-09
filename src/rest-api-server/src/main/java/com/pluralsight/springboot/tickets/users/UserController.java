package com.pluralsight.springboot.tickets.users;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private Map<String, String> sids;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private AuthUser emptyBody() {
        return new AuthUser(null, null, null, null);
    }

    private AuthUser message(String text) {
        return new AuthUser(text, null null, null);
    }

    private AuthUser user(String email, String username, String password) {
        return new AuthUser(null, new Email(email), new Username(username), new Password(password));
    }

    @GetMapping(path = "/api/user")
    public AuthUser user(@CookieValue("sid") String sid) {
        /*return userRepository.findByUsername(sids[sid])
                .orElseThrow(() -> new NoSuchElementException("User with username " + username + " not found"));*/
        return new emptyBody();
    }

    @PostMapping(path = "/api/login")
    public AuthUser login(@RequestBody AuthUser user) {
        Optional<User> userByUsername = userRepository.findByUsername(user.email().value());
        if (userByUsername.isPresent()) {
            return new message("PRESENT");
        } else {
            Optional<User> userByEmail = userRepository.findByEmail(user.email().value());
            if (userByEmail.isPresent()) {
                return new message("PRESENT");
            } else {
                //return new Message("Given Email or Username Does Not Exist");
                return new message("NOT PRESENT");
            }
        }
    }

    @PostMapping(path = "/api/register")
    public AuthUser register(@RequestBody AuthUser user) {
        String sid = "12345";
        sids[sid] = user.username().value();
        response.addCookie(new Cookie("sid", sid));
        return user;
    }
}
