import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = {}; // ✅ Lưu danh sách các subscriptions
  }
  connect(callback) {
    if (this.client && this.isConnected) {
      console.log("⚠ WebSocket đã được kết nối!");
      return;
    }
    const socket = new SockJS("http://localhost:8080/ws");
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket Connected!");
        this.isConnected = true; // ✅ Đánh dấu WebSocket đã kết nối
        if (callback) callback();
      },
      onStompError: (frame) => {
        console.error("❌ WebSocket Error:", frame);
        this.isConnected = false; // ❌ Nếu có lỗi, đánh dấu mất kết nối
      },
    });

    this.client.activate();
  }
  // ✅ Hàm kiểm tra kết nối WebSocket
  isConnected() {
    return this.client && this.client.connected;
  }

  disconnect() {
    if (this.client) {
      Object.values(this.subscriptions).forEach((sub) => sub.unsubscribe()); // ✅ Hủy tất cả subscriptions
      this.subscriptions = {}; // ✅ Xóa danh sách subscription
      this.client.deactivate();
      console.log("🔌 WebSocket Disconnected!");
      this.isConnected = false;
      this.client = null;
    }
  }
  sendReadyRequest(gameId, username) {
    if (!gameId || !username) {
        console.error("❌ LỖI: gameId hoặc username bị null hoặc undefined!");
        return;
    }

    console.log("📩 Gửi trạng thái sẵn sàng:", { gameId, username });
    this.client.publish({
        destination: "/app/game/ready",
        body: JSON.stringify({ gameId: gameId, player: username })
    });
  }

  subscribeToGame(gameId, callback) {
    console.log("✅ Đăng ký WebSocket với gameId:", gameId);
  
    if (!this.client || !this.client.connected) {
      console.warn("⚠ WebSocket chưa kết nối, thử lại sau...");
      setTimeout(() => this.subscribeToGame(gameId, callback), 500);
      return;
    }
    this.client.subscribe(`/topic/game/${gameId}`, (message) => {
      
      try {
        const data = JSON.parse(message.body);
        console.log("📩 Dữ liệu sau khi parse JSON:", data);
        
        if (data.type === "playerUpdate") {
          console.log("👤 Nhận playerUpdate:", data.playerBlack, data.playerRed);
        } else {
          console.warn("⚠ Nhận tin nhắn nhưng không phải playerUpdate:", data);
        }
  
        callback(data);
      } catch (error) {
        console.error("❌ LỖI: Không thể parse JSON từ WebSocket!", error);
      }
    });
  }

  unsubscribeFromGame(gameId) {
    if (this.subscriptions[gameId]) {
      this.subscriptions[gameId].unsubscribe();
      delete this.subscriptions[gameId]; // ✅ Xóa khỏi danh sách subscription
      console.log(`🔕 Unsubscribed from game ${gameId}`);
    }
  }

  sendRefreshRequest(gameId, username) {
    console.log("🔄 Gửi WebSocket REFRESH với:", JSON.stringify({ gameId, player: username }));
  
    // Kiểm tra gameId và username có hợp lệ không
    if (!gameId || !username) {
      console.error("❌ LỖI: gameId hoặc username bị null hoặc undefined!");
      return;
    }
  
    // Kiểm tra WebSocket có kết nối không
    if (!this.isConnected || !this.client) {
      console.error("❌ LỖI: WebSocket chưa kết nối!");
      return;
    }
  
    // Gửi yêu cầu REFRESH thông qua WebSocket
    this.client.publish({
      destination: "/app/game/refresh",
      body: JSON.stringify({ gameId: gameId, player: username })
    });
  }
  

  setupRefreshOnUnload(gameId, username) {
    this.unloadHandler = () => {
      // Kiểm tra kết nối WebSocket trước khi gửi yêu cầu REFRESH
      if (this.isConnected && this.client) {
        this.sendRefreshRequest(gameId, username);
      } else {
        console.warn("⚠ WebSocket không kết nối khi người chơi refresh trang!");
      }
    };
  
    // Thêm sự kiện beforeunload
    window.addEventListener("beforeunload", this.unloadHandler);
  }
  

  sendJoinRequest(gameId, username) {
    console.log("📩 Gửi WebSocket tham gia game với:", JSON.stringify({ gameId, player: username }));
  
    if (!gameId) {
      console.error("❌ LỖI: gameId bị null hoặc undefined!");
      return;
    }
    this.client.publish({
      destination: "/app/game/join",
      body: JSON.stringify({ gameId: gameId, player: username }) // ✅ Đảm bảo `gameId` không bị null
    });
  }

  
  sendLeaveRequest(gameId, username) {
    console.log("📩 Gửi WebSocket rời phòng với:", JSON.stringify({ gameId, player: username }));
  
    if (!gameId) {
      console.error("❌ LỖI: gameId bị null hoặc undefined!");
      return;
    }
  
    this.client.publish({
      destination: "/app/game/leave",
      body: JSON.stringify({ gameId: gameId, player: username }) // ✅ Đảm bảo `gameId` không bị null
    });
  }

  sendMove(gameId, move) {
    if (!this.client || !this.client.connected) {
      console.warn("⚠ WebSocket chưa kết nối, không thể gửi nước đi!");
      return;
  }
    console.log("📩 Gửi nước đi:", move);
  
    this.client.publish({
      destination: `/app/game/${gameId}/move`,
      body: JSON.stringify(move),
    });
  }

  sendSurrenderNotification(gameId, player) {
    console.log(`📩 Gửi thông báo đầu hàng: ${player} đầu hàng`);
  
    if (!gameId) {
      console.error("❌ LỖI: gameId bị null hoặc undefined!");
      return;
    }
  
    this.client.publish({
      destination: "/app/game/surrender",
      body: JSON.stringify({
        gameId: gameId,
        surrenderPlayer: player,
        winner: player === "red" ? "black" : "red",  // Nếu người chơi đầu hàng là đỏ thì đen thắng, ngược lại
      })
    });
  }


  sendCheckNotification(gameId, currentPlayer, isCheck, isCheckmate) {
    console.log("📩 Gửi thông báo chiếu tướng:", JSON.stringify({ gameId, currentPlayer, isCheck, isCheckmate }));

    if (!gameId) {
        console.error("❌ LỖI: gameId bị null hoặc undefined!");
        return;
    }

    console.log("Gửi thông báo chiếu: ", { gameId, currentPlayer, isCheck, isCheckmate });
    this.client.publish({
        destination: "/app/game/check",
        body: JSON.stringify({ 
            gameId: gameId, 
            currentPlayer: currentPlayer, 
            isCheck: isCheck, 
            isCheckmate: isCheckmate 
        })
    });
}

  subscribeToChat(gameId, callback) {
    console.log("✅ Đăng ký WebSocket chat với gameId:", gameId);
  
    if (!this.client || !this.client.connected) {
      console.warn("⚠ WebSocket chưa kết nối, thử lại sau...");
      setTimeout(() => this.subscribeToChat(gameId, callback), 500);
      return;
    }
    
    const subscription = this.client.subscribe(`/topic/game/${gameId}/chat`, (message) => {
      try {
        const data = JSON.parse(message.body);
        console.log("💬 Tin nhắn chat nhận được:", data);
        callback(data);
      } catch (error) {
        console.error("❌ Không thể parse JSON chat message!", error);
      }
    });
  
    this.subscriptions[`chat_${gameId}`] = subscription;
  }
  
  unsubscribeFromChat(gameId) {
    if (this.subscriptions[`chat_${gameId}`]) {
      this.subscriptions[`chat_${gameId}`].unsubscribe();
      delete this.subscriptions[`chat_${gameId}`];
      console.log(`🔕 Unsubscribed from chat ${gameId}`);
    }
  }
  
  sendChatMessage(gameId, username, messageContent) {
    if (!this.client || !this.client.connected) {
      console.warn("⚠ WebSocket chưa kết nối, không thể gửi chat!");
      return;
    }
  
    const chatMessage = {
      sender: username,
      content: messageContent,
      timestamp: new Date().toISOString(),
    };
  
    console.log("📤 Gửi chat message:", chatMessage);
  
    this.client.publish({
      destination: `/app/game/${gameId}/chat`, // Đúng với @MessageMapping của bạn
      body: JSON.stringify(chatMessage),
    });
  }
  

}

const websocketService = new WebSocketService();
export default websocketService;
