package com.ping.todolist.repository;

import com.ping.todolist.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByCompletedOrderByCreatedAtAsc(Boolean completed);
    
    @Query("SELECT t FROM Task t ORDER BY t.createdAt ASC")
    List<Task> findAllOrderByCreatedAt();
    
    long countByCompleted(Boolean completed);
}