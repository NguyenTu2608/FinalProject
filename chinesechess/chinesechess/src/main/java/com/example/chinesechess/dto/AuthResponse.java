package com.example.chinesechess.dto;

public class AuthResponse {
    private String token;

    // Constructor
    public AuthResponse(String token) {
        this.token = token;
    }

    // Getter method
    public String getToken() {
        return token;
    }
}
