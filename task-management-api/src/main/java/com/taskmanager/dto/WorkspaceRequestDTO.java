package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WorkspaceRequestDTO {

    @NotBlank(message = "Workspace name is required")
    private String name;

    private String description;
}