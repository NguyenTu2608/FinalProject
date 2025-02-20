package com.example.chinesechess.model;

public class StatusMessage {
    private String playerId;  // ID người chơi
    private String status;    // Trạng thái (VD: "left", "won", "lost")

    // Getters và setters
    public String getPlayerId() {
        return playerId;
    }
    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}

