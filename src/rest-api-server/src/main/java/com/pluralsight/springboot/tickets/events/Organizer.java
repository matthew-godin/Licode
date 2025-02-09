package com.pluralsight.springboot.tickets.events;

import jakarta.persistence.*;

@Entity
@Table(name = "organizers")
public class Organizer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String description;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public setId(int id) {
        this.id = id;
    }

    public setName(String name) {
        this.name = name;
    }

    public setDescription(String description) {
        this.description = description;
    }
}