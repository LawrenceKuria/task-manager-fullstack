package com.lawrence.task_manager.mappers;

import com.lawrence.task_manager.domain.dto.TaskDto;
import com.lawrence.task_manager.domain.entities.Task;

public interface TaskMapper {
    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);
}
