package com.taskmanager.controller;

import com.taskmanager.config.AuthInterceptor;
import com.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.dto.TaskStatusUpdateDTO;
import com.taskmanager.service.TaskService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponseDTO> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        TaskResponseDTO response = taskService.createTask(projectId, userId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/api/projects/{projectId}/tasks")
    public ResponseEntity<Page<TaskResponseDTO>> getTasksForProject(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(taskService.getTasksForProject(projectId, userId, pageable));
    }

    @GetMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskResponseDTO> getTask(
            @PathVariable Long taskId, HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(taskService.getTaskById(taskId, userId));
    }

    @PutMapping("/api/tasks/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(taskService.updateTask(taskId, userId, request));
    }

    @PatchMapping("/api/tasks/{taskId}/status")
    public ResponseEntity<TaskResponseDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateDTO request,
            HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, userId, request));
    }

    @DeleteMapping("/api/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId, HttpServletRequest httpRequest) {
        Long userId = AuthInterceptor.getCurrentUserId(httpRequest);
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }
}