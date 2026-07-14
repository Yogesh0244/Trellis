package com.taskmanager.controller;

import com.taskmanager.config.AuthInterceptor;
import com.taskmanager.dto.LoginRequestDTO;
import com.taskmanager.dto.LoginResponseDTO;
import com.taskmanager.dto.RegisterRequestDTO;
import com.taskmanager.dto.UpdateProfileRequestDTO;
import com.taskmanager.dto.UserResponseDTO;
import com.taskmanager.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        UserResponseDTO response = userService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(userService.getCurrentUser(userId));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
}