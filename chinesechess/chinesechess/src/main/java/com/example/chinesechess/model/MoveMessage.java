package com.example.chinesechess.model;

public class MoveMessage {
    private String playerId;  // ID người chơi thực hiện nước đi
    private String from;      // Vị trí quân cờ di chuyển (VD: "E2")
    private String to;        // Vị trí mới của quân cờ (VD: "E4")
    private String boardState; // Trạng thái bàn cờ (chuỗi JSON lưu vị trí quân cờ)

    // Getters và setters
    public String getPlayerId() {
        return playerId;
    }
    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
    public String getFrom() {
        return from;
    }
    public void setFrom(String from) {
        this.from = from;
    }
    public String getTo() {
        return to;
    }
    public void setTo(String to) {
        this.to = to;
    }
    public String getBoardState() {
        return boardState;
    }
    public void setBoardState(String boardState) {
        this.boardState = boardState;
    }
}
