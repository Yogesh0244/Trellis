package com.taskmanager.service;

import com.taskmanager.dto.WorkspaceRequestDTO;
import com.taskmanager.dto.WorkspaceResponseDTO;
import com.taskmanager.entity.User;
import com.taskmanager.entity.Workspace;
import com.taskmanager.exception.ForbiddenException;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    @Transactional
    public WorkspaceResponseDTO createWorkspace(Long ownerId, WorkspaceRequestDTO request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerId));

        Workspace workspace = Workspace.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        Workspace saved = workspaceRepository.save(workspace);
        return mapToResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponseDTO> getWorkspacesForUser(Long userId) {
        return workspaceRepository.findByOwnerId(userId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkspaceResponseDTO getWorkspaceById(Long workspaceId, Long requesterId) {
        Workspace workspace = findWorkspaceOrThrow(workspaceId);
        verifyOwnership(workspace, requesterId);
        return mapToResponseDTO(workspace);
    }

    @Transactional
    public WorkspaceResponseDTO updateWorkspace(Long workspaceId, Long requesterId, WorkspaceRequestDTO request) {
        Workspace workspace = findWorkspaceOrThrow(workspaceId);
        verifyOwnership(workspace, requesterId);

        workspace.setName(request.getName());
        workspace.setDescription(request.getDescription());

        Workspace updated = workspaceRepository.save(workspace);
        return mapToResponseDTO(updated);
    }

    @Transactional
    public void deleteWorkspace(Long workspaceId, Long requesterId) {
        Workspace workspace = findWorkspaceOrThrow(workspaceId);
        verifyOwnership(workspace, requesterId);
        workspaceRepository.delete(workspace);
    }

    // Package-private: reused by ProjectService/TaskService so "does this workspace
    // belong to this user" logic lives in exactly one place.
    Workspace findWorkspaceOrThrow(Long workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + workspaceId));
    }

    void verifyOwnership(Workspace workspace, Long requesterId) {
        if (!workspace.getOwner().getId().equals(requesterId)) {
            throw new ForbiddenException("You do not have permission to access this workspace");
        }
    }

    private WorkspaceResponseDTO mapToResponseDTO(Workspace workspace) {
        return WorkspaceResponseDTO.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .ownerId(workspace.getOwner().getId())
                .ownerName(workspace.getOwner().getName())
                .createdAt(workspace.getCreatedAt())
                .build();
    }
}