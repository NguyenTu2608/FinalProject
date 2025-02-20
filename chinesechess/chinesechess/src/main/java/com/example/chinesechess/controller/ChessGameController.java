package com.example.chinesechess.controller;

import com.example.chinesechess.model.MoveMessage;
import com.example.chinesechess.model.StatusMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChessGameController {

    // Xử lý nước đi của người chơi
    @MessageMapping("/move") // Client gửi tin nhắn tới đường dẫn "/app/move"
    @SendTo("/topic/game") // Tin nhắn sẽ gửi tới tất cả client đang theo dõi "/topic/game"
    public MoveMessage processMove(MoveMessage move) {
        // TODO: Thêm logic kiểm tra nước đi hợp lệ (backend-side)
        return move; // Trả về thông tin nước đi (bàn cờ sẽ được đồng bộ với tất cả client)
    }

    // Xử lý khi một người chơi rời khỏi trận
    @MessageMapping("/leave")
    @SendTo("/topic/game")
    public StatusMessage playerLeave(StatusMessage status) {
        return status; // Gửi thông báo người chơi rời phòng
    }
}
