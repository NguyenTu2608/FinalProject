package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.MoveDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {

    @MessageMapping("/move") // Khi client gửi nước đi
    @SendTo("/topic/game")   // Gửi nước đi cho tất cả người chơi
    public MoveDTO makeMove(MoveDTO move) {
        System.out.println("Move received: " + move);
        return move; // Trả về nước đi cho client khác
    }
}
