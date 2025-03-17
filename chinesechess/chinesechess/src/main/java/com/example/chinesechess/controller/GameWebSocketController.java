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

import java.util.Optional;

@Controller
public class GameWebSocketController {

    private final GameService gameService;

    public GameWebSocketController(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * Xử lý khi người chơi tham gia vào phòng game.
     * Client gửi lên `/app/game/{gameId}/join`, Server sẽ broadcast đến `/topic/game/{gameId}`
     */
    @MessageMapping("/game/{gameId}/join")
    @SendTo("/topic/game/{gameId}")
    public Game joinGame(@DestinationVariable String gameId, @Payload GameRequest request) {
        Optional<Game> optionalGame = gameService.getGameById(gameId);
        if (optionalGame.isEmpty()) {
            throw new RuntimeException("❌ Game không tồn tại!");
        }

        Game game = optionalGame.get();

        // ✅ Nếu chưa có playerBlack, gán người chơi đầu tiên làm playerBlack
        if (game.getPlayerBlack() == null) {
            game.setPlayerBlack(request.getPlayerBlack());
        } else if (game.getPlayerRed() == null && !game.getPlayerBlack().equals(request.getPlayerBlack())) {
            game.setPlayerRed(request.getPlayerRed());
        }

        System.out.println("📩 Người chơi tham gia phòng: Black=" + game.getPlayerBlack() + ", Red=" + game.getPlayerRed());

        return game; // ✅ Gửi lại thông tin game
    }


    /**
     * Xử lý nước đi của người chơi.
     * Client gửi nước đi lên `/app/game/{gameId}/move`, Server sẽ gửi lại cập nhật cho `/topic/game/{gameId}`
     */
    @MessageMapping("/game/{gameId}/move")
    @SendTo("/topic/game/{gameId}")
    public Game makeMove(@DestinationVariable String gameId, @Payload MoveDTO move) {
        Optional<Game> optionalGame = gameService.getGameById(gameId);
        if (optionalGame.isEmpty()) {
            throw new RuntimeException("❌ Game không tồn tại!");
        }

        Game game = optionalGame.get();

        // Kiểm tra người chơi hợp lệ
        if (!move.getPlayer().equals(game.getPlayerBlack()) && !move.getPlayer().equals(game.getPlayerRed())) {
            throw new IllegalArgumentException("❌ Người chơi không hợp lệ!");
        }

        // Kiểm tra lượt chơi
        if (!move.getPlayer().equals(game.getCurrentTurn())) {
            throw new IllegalArgumentException("❌ Không phải lượt của bạn!");
        }

        // Lưu nước đi vào danh sách lịch sử
        game.getMoves().add(move);

        // Chuyển lượt sau khi đi
        game.switchTurn();

        // Cập nhật trạng thái game
        gameService.updateGame(game);

        return game; // ✅ Gửi lại toàn bộ trạng thái game cho cả hai người chơi
    }
}
