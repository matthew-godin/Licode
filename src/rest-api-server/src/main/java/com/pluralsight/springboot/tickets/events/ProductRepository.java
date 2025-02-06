package com.pluralsight.springboot.tickets.events;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class VenueRepository {
    private final List<Venue> venues = List.of(
        new Venue(101, "AAA", "AAAAA", "AA", "A"),
        new Venue(102, "BBB", "BBBBB", "BB", "B"),
        new Venue(103, "CCC", "CCCCC", "CC", "C"),
        new Venue(104, "DDD", "DDDDD", "DD", "D"),
    );

    public Optional<Venue> findById(int id) {
        return return venues.stream().filter(venue -> venue.id() == id).findAny();
    }
}