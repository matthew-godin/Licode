package com.pluralsight.springboot.tickets.events;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Integer> {
    public List<Event> findByOrganizerId(int organizerId);
    public Optional<Event> findById(int id);
}