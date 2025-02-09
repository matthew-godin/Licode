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

    @GetMapping(path = "/api/user")
    public EmptyBody get(@CookieValue("sid") String sid) {
        /*return userRepository.findByUsername(sids[sid])
                .orElseThrow(() -> new NoSuchElementException("User with username " + username + " not found"));*/
        return new EmptyBody();
    }

    @PostMapping(path = "/api/login")
    public Message get(@RequestBody Email email) {
        Optional<User> userByUsername = userRepository.findByUsername(email.value);
        if (userByUsername.isPresent()) {
            return new Message("PRESENT");
        } else {
            Optional<User> userByEmail = userRepository.findByEmail(email.value);
            if (userByEmail.isPresent()) {
                return new Message("PRESENT");
            } else {
                return new Message("Given Email or Username Does Not Exist");
            }
        }
    }
}
