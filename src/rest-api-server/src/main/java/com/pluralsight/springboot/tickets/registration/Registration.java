package com.pluralsight.springboot.tickets.registration;

public record Registration(
    int id,
    @NotNull(message = "Product id is required") int productId,
    String ticketCode,
    @NotBlank(message = "Attendee name is required") String attendeeName
) {

}