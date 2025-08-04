package com.lawrence.task_manager.services;

import com.lawrence.task_manager.domain.entities.TaskList;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskListService {
    List<TaskList> listTasklists();
    TaskList createTaskList(TaskList taskList);
    Optional<TaskList> getTaskList(UUID id);
    TaskList updateTaskList(UUID id, TaskList taskList);
    void deleteTaskList(UUID taskListId);
}
