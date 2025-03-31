package com.example.chinesechess.controller;

import com.example.chinesechess.DTO.ChatMessage;
import com.example.chinesechess.DTO.MoveDTO;
import com.example.chinesechess.model.Game;
import com.example.chinesechess.model.Position;
import com.example.chinesechess.service.GameService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.ArrayList;
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
        String playerUsername = (String) request.get("player");

        Optional<Game> optionalGame = gameService.getGameById(gameId);
        if (optionalGame.isEmpty()) {
            System.out.println("❌ Không tìm thấy gameId = " + gameId);
            return;
        }

        Game game = optionalGame.get();

        // 🏆 Kiểm tra nếu người chơi đã ở trong phòng, giữ nguyên vị trí của họ
        if (playerUsername.equals(game.getPlayerBlack()) || playerUsername.equals(game.getPlayerRed())) {
            System.out.println("🔄 Người chơi đã có trong phòng, không thay đổi vị trí.");
        } else {
            // 🏆 Nếu chưa có, gán vào vị trí phù hợp
            if (game.getPlayerBlack() == null) {
                game.setPlayerBlack(playerUsername);
            } else if (game.getPlayerRed() == null) {
                game.setPlayerRed(playerUsername);
            } else {
                System.out.println("⚠ Phòng đã đầy, không thể thêm người chơi mới.");
                return;
            }
        }

        if (game.getPlayerBlack() != null && game.getPlayerRed() != null) {
            game.setGameStatus("starting"); // Trạng thái game thành "starting"
        }

        gameService.updateGame(game);

        System.out.println("✅ Cập nhật người chơi: Black=" + game.getPlayerBlack() + ", Red=" + game.getPlayerRed());

        // 🏆 Gửi cập nhật đến tất cả người chơi trong phòng
        Map<String, Object> response = new HashMap<>();
        response.put("type", "playerUpdate");
        response.put("gameId", gameId);
        response.put("playerBlack", game.getPlayerBlack());
        response.put("playerRed", game.getPlayerRed());

        messagingTemplate.convertAndSend("/topic/game/" + gameId, response);
    }


    //san sang
    @MessageMapping("/game/ready")
    public void playerReady(@Payload Map<String, Object> request) {
        System.out.println("Nhận trạng thái sẵn sàng của " + request);
        String gameId = (String) request.get("gameId");
        String player = (String) request.get("player");

        Optional<Game> optionalGame = gameService.getGameById(gameId);
        if (optionalGame.isEmpty()) {
            System.out.println("❌ Không tìm thấy gameId = " + gameId);
            return;
        }
        Game game = optionalGame.get();
        // Kiểm tra nếu người chơi hợp lệ
        if ((game.getPlayerBlack() == null || game.getPlayerRed() == null) ||
                (!game.getPlayerBlack().equals(player) && !game.getPlayerRed().equals(player))) {
            System.out.println("❌ Người chơi không hợp lệ hoặc chưa đủ người.");
            return;
        }
        // Cập nhật trạng thái sẵn sàng
        if (game.getPlayerBlack().equals(player)) {
            game.setBlackReady(true);
        } else if (game.getPlayerRed().equals(player)) {
            game.setRedReady(true);
        }
        // Lưu thay đổi vào database
        gameService.updateGame(game);
        // Gửi cập nhật trạng thái đến frontend
        Map<String, Object> response = new HashMap<>();
        response.put("type", "readyStatus");
        response.put("gameId", gameId);
        response.put("blackReady", game.isBlackReady());
        response.put("redReady", game.isRedReady());

        messagingTemplate.convertAndSend("/topic/game/" + gameId, response);
        System.out.println("123 " + response);

        // Nếu cả hai đều sẵn sàng, bắt đầu game
        if (game.isBlackReady() && game.isRedReady()) {
            Map<String, Object> startGameMessage = new HashMap<>();
            startGameMessage.put("type", "gameStart");
            startGameMessage.put("message", "Game bắt đầu!");
            messagingTemplate.convertAndSend("/topic/game/" + gameId, startGameMessage);
            System.out.println("Gửi tin nhắn game bắt đầu : " + startGameMessage);
        }
    }



    //roi phong
    @MessageMapping("/game/leave")
    public void leaveGame(@Payload Map<String, Object> request) {
        System.out.println("📩 Nhận yêu cầu rời phòng: " + request);

        String gameId = (String) request.get("gameId");
        String playerUsername = (String) request.get("player");

        Optional<Game> optionalGame = gameService.getGameById(gameId);
        if (optionalGame.isEmpty()) {
            System.out.println("❌ Game không tồn tại!");
            return;
        }

        Game game = optionalGame.get();
        boolean isPlayerInGame = false;

        // 🔥 Kiểm tra và loại bỏ người chơi khỏi phòng
        if (playerUsername.equals(game.getPlayerBlack())) {
            game.setPlayerBlack(null);
            game.setCurrentTurn("black");
            game.setBlackReady(false);
            game.setGameStatus("waiting");
            game.setRedReady(false);
            game.setMoves(null);
            isPlayerInGame = true;
        } else if (playerUsername.equals(game.getPlayerRed())) {
            game.setPlayerRed(null);
            game.setRedReady(false);
            game.setBlackReady(false);
            game.setGameStatus("waiting");
            game.setCurrentTurn("black");
            game.setMoves(null);
            isPlayerInGame = true;
        }

        if (!isPlayerInGame) {
            System.out.println("⚠ Người chơi không có trong phòng!");
            return;
        }

        // 🔥 Nếu không còn ai trong phòng => Xóa phòng
        if (game.getPlayerBlack() == null && game.getPlayerRed() == null) {
            gameService.deleteGame(gameId);
            System.out.println("🚀 Phòng " + gameId + " đã được reset vì không còn người chơi.");
        } else {
            // 🔥 Cập nhật lại trạng thái phòng nếu vẫn còn người chơi
            gameService.updateGame(game);
            System.out.println("✅ Người chơi đã rời phòng: " + playerUsername);
        }

        // 🔥 Gửi thông báo cập nhật danh sách người chơi
        Map<String, Object> response = new HashMap<>();
        response.put("type", "playerUpdate");
        response.put("gameId", gameId);
        response.put("playerBlack", game.getPlayerBlack());
        response.put("playerRed", game.getPlayerRed());

        messagingTemplate.convertAndSend("/topic/game/" + gameId, response);
    }

    @MessageMapping("/game/surrender")
    public void handleSurrender(@Payload Map<String, String> payload) {
        String gameId = payload.get("gameId");
        String surrenderPlayer = payload.get("surrenderPlayer");
        String winner = surrenderPlayer.equals("red") ? "black" : "red";
        System.out.println("Người win" + winner);

        // Kiểm tra và cập nhật trạng thái game
        Optional<Game> gameOpt = gameService.getGameById(gameId);
        if (gameOpt.isPresent()) {
            Game game = gameOpt.get();
            game.setWinner(winner);
            game.setGameStatus("finished");
            gameService.updateGame(game);
        }

        // Gửi thông báo đầu hàng đến tất cả client trong phòng
        Map<String, Object> response = new HashMap<>();
        response.put("type", "surrender");
        response.put("surrenderPlayer", surrenderPlayer);
        response.put("winner", winner);

        messagingTemplate.convertAndSend("/topic/game/" + gameId, response);
    }

    @MessageMapping("/game/check")
    public void handleCheck(@Payload Map<String, Object> request) {
        System.out.println("📩 Nhận thông báo chiếu từ client: " + request);
        String gameId = (String) request.get("gameId");
        boolean isCheck = (boolean) request.get("isCheck");
        boolean isCheckmate = (boolean) request.get("isCheckmate");
        String player = (String) request.get("player");
        // Gửi thông báo về cho tất cả client trong phòng


        Map<String, Object> response = new HashMap<>();
        response.put("type", "checkNotification");
        response.put("gameId", gameId);
        response.put("isCheck", isCheck);
        response.put("isCheckmate", isCheckmate);
        response.put("player", player);

        if (isCheckmate) {
            String winner = player; // Người chiếu bí là người thắng
            try {
                gameService.setWinner(gameId, winner); // ✅ Cập nhật người thắng trong DB
                response.put("winner", winner);
            } catch (Exception e) {
                System.err.println("❌ Lỗi khi cập nhật người thắng vào DB: " + e.getMessage());
            }
        }

        messagingTemplate.convertAndSend("/topic/game/" + gameId, response);

        System.out.println("🔥 Gửi thông báo chiếu: " + (isCheckmate ? "Chiếu bí!" : "Chiếu tướng!"));
    }


    @MessageMapping("/game/{gameId}/move")
    public void handleMove(@DestinationVariable String gameId, @Payload Map<String, Object> moveData) {
        System.out.println("📩 Nhận nước đi từ WebSocket: " + moveData);
        Optional<Game> optionalGame = gameService.getGameById(gameId);
        if (optionalGame.isEmpty()) {
            System.out.println("❌ Game không tồn tại!");
            return;
        }
        Game game = optionalGame.get();
        // 🔥 Kiểm tra nếu không đúng lượt chơi
        if (!moveData.get("player").equals(game.getCurrentTurn())) {
            System.out.println("❌ Không phải lượt của " + moveData.get("player") + " (Hiện tại: " + game.getCurrentTurn() + ")");
            return;
        }

        // Lấy vị trí từ moveData (giả sử moveData chứa row và col dưới dạng số nguyên)
        Map<String, Object> fromData = (Map<String, Object>) moveData.get("from");
        Map<String, Object> toData = (Map<String, Object>) moveData.get("to");

        // Chuyển đổi thành đối tượng Position
        Position fromPos = new Position((int) fromData.get("row"), (int) fromData.get("col"));
        Position toPos = new Position((int) toData.get("row"), (int) toData.get("col"));

        // Tạo MoveDTO
        MoveDTO move = new MoveDTO(fromPos, toPos, moveData.get("piece").toString(), game.getCurrentTurn());
        if (game.getMoves() == null) {
            game.setMoves(new ArrayList<>());
        }
        game.getMoves().add(move);


        game.switchTurn();
        gameService.updateGame(game);
        moveData.put("type", "gameMove");
        moveData.put("gameId", gameId);
        moveData.put("currentTurn", game.getCurrentTurn()); // ✅ Cập nhật lượt chơi
        moveData.put("movedPiece", moveData.get("piece"));
        moveData.put("from", moveData.get("from"));
        moveData.put("to", moveData.get("to"));

        messagingTemplate.convertAndSend("/topic/game/" + gameId, moveData);
        System.out.println("✅ Gửi nước đi tới WebSocket: " + moveData);
    }

    //chat
    @MessageMapping("/game/{gameId}/chat")
    public void handleChatMessage(@DestinationVariable String gameId, @Payload ChatMessage chatMessage) {
        System.out.println("💬 Nhận tin nhắn chat từ " + chatMessage.getSender() + ": " + chatMessage.getContent());

        // Broadcast tới tất cả người chơi trong game room
        messagingTemplate.convertAndSend("/topic/game/" + gameId + "/chat", chatMessage);
    }


}
