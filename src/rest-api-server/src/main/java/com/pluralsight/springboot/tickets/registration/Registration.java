package com.pluralsight.springboot.tickets.registration;

import jakarta.persistence.*;

@Entity
@Table(name = "registrations")
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int productId;

    @Column
    private String ticketCode;

    @Column
    private String attendeeName;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int id) {
        this.productId = productId;
    }

    public int getTicketCode() {
        return ticketCode;
    }

    public void setTicketCode(int ticketCode) {
        this.ticketCode = ticketCode;
    }

    public int getAttendeeName() {
        return attendeeName;
    }

    public void setAttendeeName(int attendeeName) {
        this.attendeeName = attendeeName;
    }
}
