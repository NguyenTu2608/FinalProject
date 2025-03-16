import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = {};
    }

    connect(callback) {
        const socket = new SockJS("http://localhost:8080/ws"); // Kết nối đến WebSocket backend
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu mất kết nối
            onConnect: () => {
                console.log("✅ WebSocket Connected");
                if (callback) callback();
            },
            onDisconnect: () => console.log("❌ WebSocket Disconnected"),
            onStompError: (frame) => console.error("❗ STOMP Error:", frame),
        });

        this.stompClient.activate();
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            console.log("🔌 Disconnected from WebSocket");
        }
    }

    subscribe(topic, callback) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error("⚠️ WebSocket is not connected yet.");
            return;
        }

        if (this.subscriptions[topic]) {
            console.warn(`⚠️ Already subscribed to ${topic}`);
            return;
        }

        this.subscriptions[topic] = this.stompClient.subscribe(topic, (message) => {
            callback(JSON.parse(message.body));
        });

        console.log(`📩 Subscribed to ${topic}`);
    }

    unsubscribe(topic) {
        if (this.subscriptions[topic]) {
            this.subscriptions[topic].unsubscribe();
            delete this.subscriptions[topic];
            console.log(`📭 Unsubscribed from ${topic}`);
        }
    }

    sendMessage(destination, body) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error("⚠️ WebSocket is not connected yet.");
            return;
        }

        this.stompClient.publish({
            destination: destination,
            body: JSON.stringify(body),
        });

        console.log(`📤 Sent message to ${destination}`);
    }
}

const websocketService = new WebSocketService();
export default websocketService;
