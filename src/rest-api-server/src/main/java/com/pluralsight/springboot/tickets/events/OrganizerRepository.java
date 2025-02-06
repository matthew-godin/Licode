package com.pluralsight.springboot.tickets.events;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrganizerRepository {
    private final List<Organizer> organizers = List.of(
        new Organizer(101, "AAA", "AAAAA"),
        new Organizer(102, "BBB", "BBBBB")
    );

    public List<Organizer> findAll() {
        return organizers;
    }
}