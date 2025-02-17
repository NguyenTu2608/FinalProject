package com.example.chinesechess.dto;

public class UserDTO {
    private String username;
    private String password;

    // Constructor không tham số
    public UserDTO() {}

    // Constructor có tham số
    public UserDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getter & Setter cho username
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // Getter & Setter cho password
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "AuthDTO{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
