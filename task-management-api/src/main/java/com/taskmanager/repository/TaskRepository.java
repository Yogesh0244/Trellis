package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Pageable query method — powers the paginated + sorted "get all tasks for a project" endpoint
    Page<Task> findByProjectId(Long projectId, Pageable pageable);
}