package com.example.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "games") // Đánh dấu đây là collection trong MongoDB
public class ChessGame {
    @Id
    private String id;
    private String player1;
    private String player2;
    private List<String> moves;
    private String winner;

    // Constructors
    public ChessGame() {}

    public ChessGame(String player1, String player2, List<String> moves, String winner) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = moves;
        this.winner = winner;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPlayer1() { return player1; }
    public void setPlayer1(String player1) { this.player1 = player1; }

    public String getPlayer2() { return player2; }
    public void setPlayer2(String player2) { this.player2 = player2; }

    public List<String> getMoves() { return moves; }
    public void setMoves(List<String> moves) { this.moves = moves; }

    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }
}
