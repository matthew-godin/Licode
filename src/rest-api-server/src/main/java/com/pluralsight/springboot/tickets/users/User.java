package com.pluralsight.springboot.tickets.users;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    private int id;

    @Column
    private String email;

    @Column
    private String username;

    @Column
    private int num_wins;

    @Column
    private int num_losses;

    @Column
    private int elo_rating;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getNumWins() {
        return num_wins;
    }

    public void setNumWins(int num_wins) {
        this.num_wins = num_wins;
    }

    public int getNumLosses() {
        return num_losses;
    }

    public void setNumLosses(int num_losses) {
        this.num_losses = num_losses;
    }

    public int getEloRating() {
        return elo_rating;
    }

    public void setEloRating(int elo_rating) {
        this.elo_rating = elo_rating;
    }
}
