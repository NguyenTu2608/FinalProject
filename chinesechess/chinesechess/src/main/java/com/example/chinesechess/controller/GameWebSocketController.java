package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.GameRequest;
import com.example.chinesechess.DTO.MoveDTO;
import com.example.chinesechess.model.Game;
import com.example.chinesechess.service.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameWebSocketController {

    public GameService gameService;


    @MessageMapping("/game/{gameId}/join")
    @SendTo("/topic/game/{gameId}")
    public String joinGame(@Payload GameRequest request) {
        return request.getPlayerBlack() + " has joined the game!";
    }

    @MessageMapping("/game/{gameId}/move")
    @SendTo("/topic/game/{gameId}")
    public Game makeMove(@DestinationVariable String gameId, MoveDTO move) {
        Game game = gameService.getGameById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        if (game == null) {
            throw new IllegalArgumentException("Game not found");
        }
        // Kiểm tra xem người chơi hợp lệ không
        if (!move.getPlayer().equals(game.getPlayerBlack()) && !move.getPlayer().equals(game.getPlayerRed())) {
            throw new IllegalArgumentException("Invalid player");
        }

        // Kiểm tra lượt chơi
        if (!move.getPlayer().equals(game.getCurrentTurn())) {
            throw new IllegalArgumentException("Not your turn");
        }

        // Lưu nước đi vào danh sách lịch sử
        game.getMoves().add(move);

        // Chuyển lượt sau khi đi
        game.switchTurn();

        // Cập nhật trạng thái game
        gameService.updateGame(game);

        return game; // Gửi lại toàn bộ trạng thái game cho cả hai người chơi
    }
}
