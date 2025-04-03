package com.example.chinesechess.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Define allowed origins
        config.setAllowedOrigins(Arrays.asList(
                "https://chinachess.io.vn",  // Thêm domain của bạn
                "http://localhost:3000",            // Thêm localhost khi phát triển
                "https://www.chinachess.io.vn"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        config.setExposedHeaders(Arrays.asList("Authorization"));  // Expose Authorization header

        // Tạo nguồn cấu hình CORS và áp dụng vào tất cả các URL
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);  // Áp dụng CORS cho tất cả các endpoint
        return new CorsFilter(source);
    }
}
