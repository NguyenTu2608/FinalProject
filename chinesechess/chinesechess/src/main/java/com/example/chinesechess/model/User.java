package com.example.chinesechess.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // MongoDB collection "users"
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private int elo; // Điểm xếp hạng của người chơi

    // Constructor không tham số (cần thiết cho Spring)
    public User() {}

    // Constructor có tham số
    public User(String id, String username, String email, String password, int elo) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.elo = elo;
    }

    // Getter và Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getElo() {
        return elo;
    }

    public void setElo(int elo) {
        this.elo = elo;
    }
}
