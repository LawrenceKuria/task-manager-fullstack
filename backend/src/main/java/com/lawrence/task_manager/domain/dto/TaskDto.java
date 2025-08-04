package com.lawrence.task_manager.domain.dto;

import com.lawrence.task_manager.domain.entities.TaskPriority;
import com.lawrence.task_manager.domain.entities.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskDto(
        UUID id,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskPriority priority,
        TaskStatus status
) {
}