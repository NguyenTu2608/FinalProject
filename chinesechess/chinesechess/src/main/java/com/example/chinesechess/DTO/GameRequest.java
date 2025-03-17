package com.example.chinesechess.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GameRequest {
    @JsonProperty("gameId") // ✅ Đảm bảo Spring Boot đọc đúng dữ liệu JSON
    private String gameId;

    private String playerRed;

    @JsonProperty("playerBlack")
    private String playerBlack;

    private String gameMode;


    // Getters and Setters
    public String getGameId()
    {
        return gameId;
    }
    public void setGameId(String gameId)
    {
        this.gameId = gameId;
    }
    public String getPlayerRed()
    {
        return playerRed;
    }
    public void setPlayerRed(String playerRed)
    {
        this.playerRed = playerRed;
    }
    public String getPlayerBlack()
    {
        return playerBlack;
    }
    public void setPlayerBlack(String playerBlack)
    {
        this.playerBlack = playerBlack;
    }

    public String getGameMode()
    {
        return gameMode;
    }
    public void setGameMode(String gameMode)
    {
        this.gameMode = gameMode;
    }

}
