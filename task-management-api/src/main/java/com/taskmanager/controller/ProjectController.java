package com.taskmanager.controller;

import com.taskmanager.config.AuthInterceptor;
import com.taskmanager.dto.ProjectRequestDTO;
import com.taskmanager.dto.ProjectResponseDTO;
import com.taskmanager.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/api/workspaces/{workspaceId}/projects")
    public ResponseEntity<ProjectResponseDTO> createProject(
            @PathVariable Long workspaceId,
            @Valid @RequestBody ProjectRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        ProjectResponseDTO response = projectService.createProject(workspaceId, userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/workspaces/{workspaceId}/projects")
    public ResponseEntity<List<ProjectResponseDTO>> getProjectsForWorkspace(
            @PathVariable Long workspaceId, HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(projectService.getProjectsForWorkspace(workspaceId, userId));
    }

    @GetMapping("/api/projects/{projectId}")
    public ResponseEntity<ProjectResponseDTO> getProject(
            @PathVariable Long projectId, HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(projectService.getProjectById(projectId, userId));
    }

    @PutMapping("/api/projects/{projectId}")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody ProjectRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(projectService.updateProject(projectId, userId, request));
    }

    @DeleteMapping("/api/projects/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId, HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        projectService.deleteProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}