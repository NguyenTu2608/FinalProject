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
        // Kích hoạt message broker cho client
        config.enableSimpleBroker("/topic"); // Đường dẫn này sẽ được dùng để gửi thông báo
        config.setApplicationDestinationPrefixes("/app"); // Tiền tố cho các API gửi từ client lên
    }

    @Override
    public void registerStompEndpoints(org.springframework.web.socket.config.annotation.StompEndpointRegistry registry) {
        // Đăng ký endpoint để client kết nối
        registry.addEndpoint("/ws").
                setAllowedOriginPatterns("*").
                withSockJS(); // Hỗ trợ SockJS
    }
}

