package com.pluralsight.springboot.licode.users;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column
    private byte[] hashed_password;

    @Column
    private byte[] salt;

    @Column
    private LocalDate updated_at;

    @Column
    private LocalDate created_at;

    @Column
    private boolean has_2400_rating_history;

    public User() { }

    public User(String email, String username, int num_wins, int num_losses, int elo_rating, byte[] hashed_password, byte[] salt, LocalDate created_at, LocalDate updated_at, boolean has_2400_rating_history) {
        this.email = email;
        this.username = username;
        this.num_wins = num_wins;
        this.num_losses = num_losses;
        this.elo_rating = elo_rating;
        this.hashed_password = hashed_password;
        this.salt = salt;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.has_2400_rating_history = has_2400_rating_history;
    }

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

    public byte[] getHashedPassword() {
        return hashed_password;
    }

    public void setHashedPassword(byte[] hashed_password) {
        this.hashed_password = hashed_password;
    }

    public byte[] getSalt() {
        return salt;
    }

    public void setSalt(byte[] salt) {
        this.salt = salt;
    }

    public LocalDate getCreatedAt() {
        return created_at;
    }

    public void setCreatedAt(LocalDate created_at) {
        this.created_at = created_at;
    }

    public LocalDate getUpdatedAt() {
        return updated_at;
    }

    public void setUpdatedAt(LocalDate updated_at) {
        this.updated_at = updated_at;
    }

    public boolean getHas2400RatingHistory() {
        return has_2400_rating_history;
    }

    public void setHas2400RatingHistory(boolean has_2400_rating_history) {
        this.has_2400_rating_history = has_2400_rating_history;
    }
}
