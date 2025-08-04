package com.lawrence.task_manager.mappers;

import com.lawrence.task_manager.domain.dto.TaskListDto;
import com.lawrence.task_manager.domain.entities.TaskList;

public interface TaskListMapper {
    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList taskList);
}
