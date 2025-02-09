package com.pluralsight.springboot.tickets.registration;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public record Registration(
    int id,
    @NotNull(message = "Product id is required") int productId,
    String ticketCode,
    @NotBlank(message = "Attendee name is required") String attendeeName
) {

}