import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-task-container">
      <h3>Add New Task</h3>
      <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
        <div class="form-group">
          <label for="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            [(ngModel)]="newTask.title"
            required
            maxlength="255"
            placeholder="Enter task title..."
            class="form-control"
            #title="ngModel"
          />
          <div *ngIf="title.invalid && title.touched" class="error-message">
            Task title is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="newTask.description"
            maxlength="1000"
            placeholder="Enter task description..."
            class="form-control"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            [disabled]="taskForm.invalid || isSubmitting"
            class="btn btn-primary"
          >
            {{ isSubmitting ? 'Adding...' : 'Add Task' }}
          </button>
          <button 
            type="button" 
            (click)="resetForm()"
            class="btn btn-secondary"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .add-task-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    h3 {
      margin-top: 0;
      color: #333;
    }
  `]
})
export class AddTaskComponent {
  newTask: Task = {
    title: '',
    description: '',
    completed: false
  };
  
  isSubmitting = false;

  constructor(private taskService: TaskService) {}

  onSubmit(): void {
    if (this.newTask.title.trim()) {
      this.isSubmitting = true;
      
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      completed: false
    };
  }
}