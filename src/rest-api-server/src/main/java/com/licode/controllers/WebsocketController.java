package com.licode.controllers;

import org.springframework.web.bind.annotation.*;
import com.licode.entities.websocket.WildcardEndpoint;

@RestController
public class WebsocketController {

    public WebsocketController() { }

    @GetMapping(path = "/api/wildcardEndpoint")
    public WildcardEndpoint wildcardEndpoint() {
        return new WildcardEndpoint("wss://matthew-godin.com/ws");
    }   
}