package com.example.chinesechess.model;

import com.example.chinesechess.DTO.MoveDTO;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "games")
public class Game {

    @Id
    private String id; // Unique ID for the game
    private String playerRed; // Username of the red player
    private String playerBlack; // Username of the black player
    private List<MoveDTO> moves; // List of moves in PGN format
    private String gameStatus; // Game status: waiting, ongoing, white_won, black_won, draw
    private String currentTurn; // "red" or "black"
    private String createdAt;
    private String gameMode;
    private boolean blackReady = false;
    private boolean redReady = false;


    public Game() {
    }

    public Game(String playerRed, String playerBlack, List<MoveDTO> moves, String gameStatus, String currentTurn, Boolean blackReady, Boolean redReady) {
        this.playerRed = playerRed;
        this.playerBlack = playerBlack;
        this.moves = moves;
        this.gameStatus = gameStatus;
        this.currentTurn = "black";
        this.blackReady = blackReady;
        this.redReady = redReady;
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

    public List<MoveDTO> getMoves() {
        return moves;
    }

    public void setMoves(List<MoveDTO> moves) {
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
    public String getGameMode()
    {
        return gameMode;
    }
    public void setGameMode(String gameMode)
    {
        this.gameMode = gameMode;
    }

    public void switchTurn() {
        this.currentTurn = this.currentTurn.equals("black") ? "red" : "black";
        System.out.println("🔄 Chuyển lượt chơi: " + this.currentTurn);
    }

    public boolean isBlackReady() {
        return blackReady;
    }

    public void setBlackReady(boolean blackReady) {
        this.blackReady = blackReady;
    }

    public boolean isRedReady() {
        return redReady;
    }

    public void setRedReady(boolean redReady) {
        this.redReady = redReady;
    }
}
