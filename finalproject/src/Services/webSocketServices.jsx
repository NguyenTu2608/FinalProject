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

  subscribeToErrors(callback) {
    console.log("📡 Đăng ký nhận lỗi từ WebSocket...");

    if (!this.client || !this.client.connected) {
        console.warn("⚠ WebSocket chưa kết nối, thử lại sau...");
        setTimeout(() => this.subscribeToErrors(callback), 500);
        return;
    }

    this.client.subscribe(`/user/queue/errors`, (message) => {
        try {
            const data = JSON.parse(message.body);
            console.log("⚠ Nhận lỗi từ WebSocket:", data);
            callback(data);
        } catch (error) {
            console.error("❌ LỖI: Không thể parse JSON từ WebSocket!", error);
        }
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
}

const websocketService = new WebSocketService();
export default websocketService;
