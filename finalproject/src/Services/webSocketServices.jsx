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
  
    console.log(`📡 Đang đăng ký topic: /topic/game/${gameId}`);
    
    this.client.subscribe(`/topic/game/${gameId}`, (message) => {
      console.log("📩 Nhận tin nhắn WebSocket thô:", message);
      
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

  sendMove(gameId, move) {
    console.log("📩 Gửi nước đi:", move);
  
    this.client.publish({
      destination: `/app/game/${gameId}/move`,
      body: JSON.stringify(move),
    });
  }
}

const websocketService = new WebSocketService();
export default websocketService;
