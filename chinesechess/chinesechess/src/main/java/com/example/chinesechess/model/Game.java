package com.example.chinesechess.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "games")
public class Game {

    @Id
    private String id; // Unique ID for the game
    private String playerRed; // Username of the red player
    private String playerBlack; // Username of the black player
    private List<Move> moves; // List of moves in PGN format
    private String gameStatus; // Game status: ongoing, white_won, black_won, draw
    private String currentTurn; // "white" or "black"
    private String createdAt;

    public Game() {
    }

    public Game(String playerRed, String playerBlack, List<Move> moves, String gameStatus, String currentTurn) {
        this.playerRed = playerRed;
        this.playerBlack = playerBlack;
        this.moves = moves;
        this.gameStatus = gameStatus;
        this.currentTurn = currentTurn;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlayerRed() {
        return playerRed;
    }

    public void setPlayerRed(String playerRed) {
        this.playerRed = playerRed;
    }

    public String getPlayerBlack() {
        return playerBlack;
    }

    public void setPlayerBlack(String playerBlack) {
        this.playerBlack = playerBlack;
    }

    public List<Move> getMoves() {
        return moves;
    }

    public void setMoves(List<Move> moves) {
        this.moves = moves;
    }

    public String getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(String gameStatus) {
        this.gameStatus = gameStatus;
    }

    public String getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(String currentTurn) {
        this.currentTurn = currentTurn;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
