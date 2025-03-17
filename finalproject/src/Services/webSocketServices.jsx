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
    console.log("✅ Gọi subscribeToGame với gameId:", gameId);

    if (!this.isConnected) {
      console.warn("⚠ WebSocket chưa kết nối, thử lại sau...");
      setTimeout(() => this.subscribeToGame(gameId, callback), 500); // ✅ Thử lại sau 500ms
      return;
    }

    const subscription = this.client.subscribe(`/topic/game/${gameId}`, (message) => {
      callback(JSON.parse(message.body));
    });

    this.subscriptions[gameId] = subscription;
    console.log("✅ Đã subscribe thành công vào game:", gameId);
  }


  unsubscribeFromGame(gameId) {
    if (this.subscriptions[gameId]) {
      this.subscriptions[gameId].unsubscribe();
      delete this.subscriptions[gameId]; // ✅ Xóa khỏi danh sách subscription
      console.log(`🔕 Unsubscribed from game ${gameId}`);
    }
  }

  sendJoinRequest(gameId, username) {
    if (!this.client || !this.client.connected) {
      console.warn("⚠ WebSocket chưa kết nối, không thể gửi yêu cầu tham gia!");
      return;
    }

    this.client.publish({
      destination: `/app/game/${gameId}/join`,
      body: JSON.stringify({ playerBlack: username }),
    });
  }

  sendMove(gameId, move) {
    if (!this.client || !this.client.connected) {
      console.warn("⚠ WebSocket chưa kết nối, không thể gửi nước đi!");
      return;
    }

    this.client.publish({
      destination: `/app/game/${gameId}/move`,
      body: JSON.stringify(move),
    });
  }
}

const websocketService = new WebSocketService();
export default websocketService;
