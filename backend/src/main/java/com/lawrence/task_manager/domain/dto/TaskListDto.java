package com.lawrence.task_manager.domain.dto;

import com.lawrence.task_manager.domain.entities.TaskPriority;
import com.lawrence.task_manager.domain.entities.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TaskListDto(
        UUID id,
        String title,
        String description,
        Integer count,
        Double progress,
        List<TaskDto> tasks
) {
}
