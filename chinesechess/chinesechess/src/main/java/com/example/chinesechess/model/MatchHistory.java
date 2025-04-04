package com.example.chinesechess.model;

import com.example.chinesechess.DTO.MoveDTO;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "match_history")
public class MatchHistory {
    @Id
    private String id;
    private String gameId;
    private String playerRed;
    private String playerBlack;
    private String winner;
    private List<MoveDTO> moves; // Danh sách nước đi
    private String gameMode; // Chế độ chơi: "online" hoặc "local"

    // Constructor mặc định
    public MatchHistory() {}

    // Constructor đầy đủ
    public MatchHistory(String gameId, String playerRed, String playerBlack, String winner, List<MoveDTO> moves, String gameMode) {
        this.gameId = gameId;
        this.playerRed = playerRed;
        this.playerBlack = playerBlack;
        this.winner = winner;
        this.moves = moves;
        this.gameMode = gameMode;
    }

    // Getter và Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
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

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public List<MoveDTO> getMoves() {
        return moves;
    }

    public void setMoves(List<MoveDTO> moves) {
        this.moves = moves;
    }

    public String getGameMode() {
        return gameMode;
    }

    public void setGameMode(String gameMode) {
        this.gameMode = gameMode;
    }

    // Phương thức toString để debug
    @Override
    public String toString() {
        return "MatchHistory{" +
                "id='" + id + '\'' +
                ", gameId='" + gameId + '\'' +
                ", playerRed='" + playerRed + '\'' +
                ", playerBlack='" + playerBlack + '\'' +
                ", winner='" + winner + '\'' +
                ", moves=" + moves +
                ", gameMode='" + gameMode + '\'' +
                '}';
    }
}

