package com.example.chinesechess.DTO;

public class GameRequest {
    private String playerRed;
    private String playerBlack;

    // Getters and Setters

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
    public void setplayerBlack(String playerBlack)
    {
        this.playerBlack = playerBlack;
    }
}
