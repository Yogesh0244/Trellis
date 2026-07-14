package com.taskmanager.service;

import com.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.dto.TaskStatusUpdateDTO;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final WorkspaceService workspaceService;
    private final UserRepository userRepository;

    @Transactional
    public TaskResponseDTO createTask(Long projectId, Long requesterId, TaskRequestDTO request) {
        Project project = projectService.findProjectOrThrow(projectId);
        workspaceService.verifyOwnership(project.getWorkspace(), requesterId);

        User assignedUser = null;
        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found with id: " + request.getAssignedUserId()));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .assignedUser(assignedUser)
                .project(project)
                .build();

        Task saved = taskRepository.save(task);
        return mapToResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponseDTO> getTasksForProject(Long projectId, Long requesterId, Pageable pageable) {
        Project project = projectService.findProjectOrThrow(projectId);
        workspaceService.verifyOwnership(project.getWorkspace(), requesterId);

        return taskRepository.findByProjectId(projectId, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public TaskResponseDTO getTaskById(Long taskId, Long requesterId) {
        Task task = findTaskOrThrow(taskId);
        workspaceService.verifyOwnership(task.getProject().getWorkspace(), requesterId);
        return mapToResponseDTO(task);
    }

    @Transactional
    public TaskResponseDTO updateTask(Long taskId, Long requesterId, TaskRequestDTO request) {
        Task task = findTaskOrThrow(taskId);
        workspaceService.verifyOwnership(task.getProject().getWorkspace(), requesterId);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User not found with id: " + request.getAssignedUserId()));
            task.setAssignedUser(assignedUser);
        } else {
            task.setAssignedUser(null);
        }

        Task updated = taskRepository.save(task);
        return mapToResponseDTO(updated);
    }

    @Transactional
    public TaskResponseDTO updateTaskStatus(Long taskId, Long requesterId, TaskStatusUpdateDTO request) {
        Task task = findTaskOrThrow(taskId);
        workspaceService.verifyOwnership(task.getProject().getWorkspace(), requesterId);

        task.setStatus(request.getStatus());

        Task updated = taskRepository.save(task);
        return mapToResponseDTO(updated);
    }

    @Transactional
    public void deleteTask(Long taskId, Long requesterId) {
        Task task = findTaskOrThrow(taskId);
        workspaceService.verifyOwnership(task.getProject().getWorkspace(), requesterId);
        taskRepository.delete(task);
    }

    private Task findTaskOrThrow(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
    }

    private TaskResponseDTO mapToResponseDTO(Task task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
                .assignedUserName(task.getAssignedUser() != null ? task.getAssignedUser().getName() : null)
                .projectId(task.getProject().getId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}