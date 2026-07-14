package com.taskmanager.service;

import com.taskmanager.dto.ProjectRequestDTO;
import com.taskmanager.dto.ProjectResponseDTO;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Workspace;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final WorkspaceService workspaceService;

    @Transactional
    public ProjectResponseDTO createProject(Long workspaceId, Long requesterId, ProjectRequestDTO request) {
        Workspace workspace = workspaceService.findWorkspaceOrThrow(workspaceId);
        workspaceService.verifyOwnership(workspace, requesterId);

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .workspace(workspace)
                .build();

        Project saved = projectRepository.save(project);
        return mapToResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getProjectsForWorkspace(Long workspaceId, Long requesterId) {
        Workspace workspace = workspaceService.findWorkspaceOrThrow(workspaceId);
        workspaceService.verifyOwnership(workspace, requesterId);

        return projectRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(Long projectId, Long requesterId) {
        Project project = findProjectOrThrow(projectId);
        workspaceService.verifyOwnership(project.getWorkspace(), requesterId);
        return mapToResponseDTO(project);
    }

    @Transactional
    public ProjectResponseDTO updateProject(Long projectId, Long requesterId, ProjectRequestDTO request) {
        Project project = findProjectOrThrow(projectId);
        workspaceService.verifyOwnership(project.getWorkspace(), requesterId);

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updated = projectRepository.save(project);
        return mapToResponseDTO(updated);
    }

    @Transactional
    public void deleteProject(Long projectId, Long requesterId) {
        Project project = findProjectOrThrow(projectId);
        workspaceService.verifyOwnership(project.getWorkspace(), requesterId);
        projectRepository.delete(project);
    }

    // Package-private: reused by TaskService.
    Project findProjectOrThrow(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
    }

    private ProjectResponseDTO mapToResponseDTO(Project project) {
        return ProjectResponseDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .workspaceId(project.getWorkspace().getId())
                .createdAt(project.getCreatedAt())
                .build();
    }
}