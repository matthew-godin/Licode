package com.pluralsight.springboot.tickets.registration;

public record Registration(
    int id,
    int productId,
    String ticketCode,
    String attendeeName
) {

}