package com.pluralsight.springboot.tickets.registration;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, String> {

    Optional<Registration> findByTicketCode(String ticketCode);

    void deleteByTicketCode(String ticketCode);
}
