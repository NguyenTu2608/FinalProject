package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.GameRequest;
import com.example.chinesechess.DTO.MoveDTO;
import com.example.chinesechess.model.Game;
import com.example.chinesechess.service.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class GameWebSocketController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate; // ✅ Khai báo biến

    // 🔥 Dùng constructor để khởi tạo messagingTemplate
    public GameWebSocketController(GameService gameService, SimpMessagingTemplate messagingTemplate) {
        this.gameService = gameService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/game/join")
    public void joinGame(@Payload Map<String, Object> request) {
        System.out.println("📩 Nhận yêu cầu tham gia game với ID: " + request);

        String gameId = (String) request.get("gameId");
        String playerUsername = (String) request.get("player");  // 🔥 Đảm bảo nhận đúng key từ FE

        Optional<Game> optionalGame = gameService.getGameById(gameId);
        if (optionalGame.isEmpty()) {
            System.out.println("❌ Không tìm thấy gameId = " + gameId);
            throw new RuntimeException("❌ Game không tồn tại!");
        }

        Game game = optionalGame.get();

        // 🏆 Nếu chưa có playerBlack, gán người đầu tiên vào
        if (game.getPlayerBlack() == null) {
            game.setPlayerBlack(playerUsername);
        }
        // 🏆 Nếu đã có playerBlack nhưng chưa có playerRed, gán người thứ hai vào
        else if (game.getPlayerRed() == null && !game.getPlayerBlack().equals(playerUsername)) {
            game.setPlayerRed(playerUsername);
        }
        else {
            System.out.println("⚠ Người chơi đã có trong phòng hoặc không hợp lệ!");
        }

        gameService.updateGame(game);

        System.out.println("✅ Cập nhật người chơi: Black=" + game.getPlayerBlack() + ", Red=" + game.getPlayerRed());

        // 🏆 Gửi cập nhật về WebSocket cho tất cả người chơi
        Map<String, Object> response = new HashMap<>();
        response.put("type", "playerUpdate");
        response.put("gameId", gameId);
        response.put("playerBlack", game.getPlayerBlack());
        response.put("playerRed", game.getPlayerRed());

        messagingTemplate.convertAndSend("/topic/game/" + gameId, response);
    }

    @MessageMapping("/game/{gameId}/move")
    public void handleMove(@DestinationVariable String gameId, @Payload Map<String, Object> moveData) {
        System.out.println("📩 Nhận nước đi từ WebSocket: " + moveData);

        // Gửi lại nước đi cho tất cả người chơi trong phòng
        moveData.put("type", "gameMove");
        moveData.put("gameId", gameId);

        messagingTemplate.convertAndSend("/topic/game/" + gameId, moveData);
        System.out.println("✅ Gửi nước đi tới WebSocket: " + moveData);
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
