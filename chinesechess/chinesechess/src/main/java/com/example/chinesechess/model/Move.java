package com.example.chinesechess.model;

public class Move {
    private Position from;
    private Position to;
    private String piece; // Ký hiệu quân cờ (ví dụ: "C", "R", "H")
    private String player; // "red" hoặc "black"

    public Move() {}

    public Move(Position from, Position to, String piece, String player) {
        this.from = from;
        this.to = to;
        this.piece = piece;
        this.player = player;
    }

    public Position getFrom() {
        return from;
    }

    public void setFrom(Position from) {
        this.from = from;
    }

    public Position getTo() {
        return to;
    }

    public void setTo(Position to) {
        this.to = to;
    }

    public String getPiece() {
        return piece;
    }

    public void setPiece(String piece) {
        this.piece = piece;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }
}

