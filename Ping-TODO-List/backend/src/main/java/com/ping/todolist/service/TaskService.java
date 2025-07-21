package com.ping.todolist.service;

import com.ping.todolist.entity.Task;
import com.ping.todolist.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    
    private final TaskRepository taskRepository;
    
    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
    
    public List<Task> getAllTasks() {
        return taskRepository.findAllOrderByCreatedAt();
    }
    
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
    
    public Task createTask(Task task) {
        task.setCompleted(false);
        return taskRepository.save(task);
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setTitle(taskDetails.getTitle());
                task.setDescription(taskDetails.getDescription());
                task.setCompleted(taskDetails.getCompleted());
                return taskRepository.save(task);
            })
            .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }
    
    public Task toggleTaskCompletion(Long id) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setCompleted(!task.getCompleted());
                return taskRepository.save(task);
            })
            .orElseThrow(() -> new RuntimeException("Task not found with id " + id));
    }
    
    public void deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
        } else {
            throw new RuntimeException("Task not found with id " + id);
        }
    }
    
    public List<Task> getTasksByStatus(Boolean completed) {
        return taskRepository.findByCompletedOrderByCreatedAtAsc(completed);
    }
    
    public long getTaskCount() {
        return taskRepository.count();
    }
    
    public long getCompletedTaskCount() {
        return taskRepository.countByCompleted(true);
    }
    
    public long getPendingTaskCount() {
        return taskRepository.countByCompleted(false);
    }
}