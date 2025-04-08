package com.example.chinesechess.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // 🔥 Thêm "/queue" để hỗ trợ tin nhắn cá nhân
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user"); // 🔥 Định nghĩa prefix cho user-specific messages
    }

    @Override
    public void registerStompEndpoints(org.springframework.web.socket.config.annotation.StompEndpointRegistry registry) {
        // Đăng ký endpoint để client kết nối
        registry.addEndpoint("/ws").
                setAllowedOriginPatterns("http://localhost:3000","https://chinachess.io.vn").
                withSockJS(); // Hỗ trợ SockJS
    }
}

