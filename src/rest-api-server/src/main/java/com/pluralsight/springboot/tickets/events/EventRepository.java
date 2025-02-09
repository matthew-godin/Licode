package com.pluralsight.springboot.tickets.events;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public class EventRepository {
    private final List<Event> events = List.of(
        new Event(101, "AAA", new Organizer(101, "AAA", "AAAAA"), new Venue(101, "AAA", "AAAAA", "AA", "A"), LocalDate.of(2024, 10, 4), LocalDate.of(2024, 10, 5)),
        new Event(101, "BBB", new Organizer(102, "BBB", "BBBBB"), new Venue(102, "BBB", "BBBBB", "BB", "B"), LocalDate.of(2024, 10, 6), LocalDate.of(2024, 10, 7)),
        new Event(101, "CCC", new Organizer(103, "CCC", "CCCCC"), new Venue(103, "CCC", "CCCCC", "CC", "C"), LocalDate.of(2024, 10, 8), LocalDate.of(2024, 10, 9))
    );

    public List<Event> findByOrganizerId(int organizerId) {
        return events.stream().filter(event -> event.organizer().id() == organizerId).toList();
    }

    public Optional<Event> findById(int id) {
        return events.stream().filter(event -> event.id() == id).findAny();
    }
}