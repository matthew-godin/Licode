package com.pluralsight.springboot.tickets.events;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    public List<Product> findByEventId(int eventId);
}