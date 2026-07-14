package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @Size(max = 280, message = "Bio must be 280 characters or fewer")
    private String bio;
}