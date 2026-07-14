package com.taskmanager.config;

import com.taskmanager.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final TokenStore tokenStore;

    public static final String CURRENT_USER_ID_ATTRIBUTE = "currentUserId";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Browsers send an OPTIONS preflight before the real request and never attach
        // the Authorization header to it — don't block those.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String token = request.getHeader("Authorization");

        if (token == null || token.isBlank()) {
            throw new UnauthorizedException("Missing Authorization header. Please log in first.");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!tokenStore.isValid(token)) {
            throw new UnauthorizedException("Invalid or expired token. Please log in again.");
        }

        request.setAttribute(CURRENT_USER_ID_ATTRIBUTE, tokenStore.getUserId(token));
        return true;
    }

    // Small helper so controllers don't repeat the same cast in every method.
    public static Long getCurrentUserId(HttpServletRequest request) {
        return (Long) request.getAttribute(CURRENT_USER_ID_ATTRIBUTE);
    }
}