package com.lawrence.task_manager.domain.dto;

public record ErrorResponse(
        int status,
        String message,
        String details
) {
}
