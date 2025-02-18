package com.example.chinesechess.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "games")
public class Game {

    @Id
    private String id; // Unique ID for the game
    private String playerWhite; // Username of the white player
    private String playerBlack; // Username of the black player
    private List<String> moves; // List of moves in PGN format
    private String gameStatus; // Game status: ongoing, white_won, black_won, draw
    private String currentTurn; // "white" or "black"

    public Game() {
    }

    public Game(String playerWhite, String playerBlack, List<String> moves, String gameStatus, String currentTurn) {
        this.playerWhite = playerWhite;
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

    public String getPlayerWhite() {
        return playerWhite;
    }

    public void setPlayerWhite(String playerWhite) {
        this.playerWhite = playerWhite;
    }

    public String getPlayerBlack() {
        return playerBlack;
    }

    public void setPlayerBlack(String playerBlack) {
        this.playerBlack = playerBlack;
    }

    public List<String> getMoves() {
        return moves;
    }

    public void setMoves(List<String> moves) {
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
}
