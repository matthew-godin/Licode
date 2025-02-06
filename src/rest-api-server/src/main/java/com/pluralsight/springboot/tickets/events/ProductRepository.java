package com.pluralsight.springboot.tickets.events;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductRepository {
    private final List<Product> products = List.of(
        new Product(101, 101, "AAA", "AAAAA", 1.1),
        new Product(102, 102, "BBB", "BBBBB", 1.2),
        new Product(103, 103, "CCC", "CCCCC", 1.3)
    );

    public List<Product> findByEventId(int eventId) {
        return products.stream().filter(product -> product.eventId() == eventId).toList();
    }
}