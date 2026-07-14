package com.taskmanager.controller;

import com.taskmanager.config.AuthInterceptor;
import com.taskmanager.dto.WorkspaceRequestDTO;
import com.taskmanager.dto.WorkspaceResponseDTO;
import com.taskmanager.service.WorkspaceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<WorkspaceResponseDTO> createWorkspace(
            @Valid @RequestBody WorkspaceRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        WorkspaceResponseDTO response = workspaceService.createWorkspace(userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceResponseDTO>> getMyWorkspaces(HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(workspaceService.getWorkspacesForUser(userId));
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponseDTO> getWorkspace(
            @PathVariable Long workspaceId, HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(workspaceService.getWorkspaceById(workspaceId, userId));
    }

    @PutMapping("/{workspaceId}")
    public ResponseEntity<WorkspaceResponseDTO> updateWorkspace(
            @PathVariable Long workspaceId,
            @Valid @RequestBody WorkspaceRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(workspaceService.updateWorkspace(workspaceId, userId, request));
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<Void> deleteWorkspace(
            @PathVariable Long workspaceId, HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        workspaceService.deleteWorkspace(workspaceId, userId);
        return ResponseEntity.noContent().build();
    }
}