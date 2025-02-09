package com.pluralsight.springboot.tickets.events;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.NoSuchElementException;
//import org.springframework.web.bind.annotation.RequestMethod;

@RestController
public class EventController {
    private final OrganizerRepository organizerRepository;
    private final EventRepository eventRepository;
    private final ProductRepository productRepository;

    public EventController(OrganizerRepository organizerRepository, EventRepository eventRepository, ProductRepository productRepository) {
        this.organizerRepository = organizerRepository;
        this.eventRepository = eventRepository;
        this.productRepository = productRepository;
    }

    //@RequestMapping(method = RequestMethod.GET, path = "/organizers")
    @GetMapping(path = "/java/organizers")
    public List<Organizer> getOrganizers() {
        return organizerRepository.findAll();
    }

    @GetMapping(path = "/java/events")
    public List<Event> getEventsByOrganizer(@RequestParam("organizerId") int organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    @GetMapping(path = "/java/events/{id}")
    public Event getEventById(@PathVariable("id") int eventId) {
        return eventRepository.findById(eventId).orElseThrow(() -> new NoSuchElementException("Event with id " + eventId + " not found"));
    }

    @GetMapping(path = "/java/products")
    public List<Product> getProductsByEvent(@RequestParam("eventId") int eventId) {
        return productRepository.findEventById(eventId);
    }
}