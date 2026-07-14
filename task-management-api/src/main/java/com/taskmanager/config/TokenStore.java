package com.taskmanager.config;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory token store used to simulate authentication
 * without pulling in the full Spring Security framework.
 * In a production system this would be replaced by JWT or OAuth2 tokens.
 */
@Component
public class TokenStore {

    private final Map<String, Long> tokenToUserId = new ConcurrentHashMap<>();

    public String generateToken(Long userId) {
        String token = UUID.randomUUID().toString();
        tokenToUserId.put(token, userId);
        return token;
    }

    public Long getUserId(String token) {
        return tokenToUserId.get(token);
    }

    public boolean isValid(String token) {
        return token != null && tokenToUserId.containsKey(token);
    }
}