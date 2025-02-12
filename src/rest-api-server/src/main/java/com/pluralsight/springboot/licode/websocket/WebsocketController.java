package com.pluralsight.springboot.licode.websocket;

@RestController
public class WebsocketController {

    public WebsocketController() { }

    @GetMapping(path = "/api/wildcardEndpoint")
    public WildcardEndpoint wildcardEndpoint() {
        return new WildcardEndpoint("wss://matthew-godin.com/ws");
    }   
}