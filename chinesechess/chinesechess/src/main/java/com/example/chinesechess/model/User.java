package com.example.chinesechess.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
    public class User {

        @Id
        private String id; // Unique user ID
        private String username; // Unique username
        private String password; // Hashed password
        private String email; // Email address
        private Integer chessElo = 1200;
        private Integer chessDownElo = 1200;
        private String avatar = "";
        private String rankChess ="Tập Sự";
        private String rankChessDown ="Tập Sự";

    public User() {
    }

    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // Getters and Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getChessElo() {
        return chessElo;
    }

    public void setChessElo(Integer chessElo) {
        this.chessElo = chessElo;
    }

    public String getAvatar() {
        return avatar.isEmpty() ? "/assets/avatar.png" : avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Integer getChessDownElo() {
        return chessDownElo;
    }

    public void setChessDownElo(Integer chessDownElo) {
        this.chessDownElo = chessDownElo;
    }

    public String getRankChess() {
        return rankChess;
    }

    public void setRankChess(String rankChess) {
        this.rankChess = rankChess;
    }

    public String getRankChessDown() {
        return rankChessDown;
    }

    public void setRankChessDown(String rankChessDown) {
        this.rankChessDown = rankChessDown;
    }
}
