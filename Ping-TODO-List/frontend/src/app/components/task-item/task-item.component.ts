import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-item" [class.completed]="task.completed">
      <div class="task-content">
        <div class="task-checkbox">
          <input
            type="checkbox"
            [checked]="task.completed"
            (change)="onToggleComplete()"
            [id]="'task-' + task.id"
          />
          <label [for]="'task-' + task.id" class="checkbox-label"></label>
        </div>
        
        <div class="task-details">
          <div class="task-title" [class.completed-text]="task.completed">
            {{ task.title }}
          </div>
          <div 
            *ngIf="task.description" 
            class="task-description"
            [class.completed-text]="task.completed"
          >
            {{ task.description }}
          </div>
          <div class="task-meta">
            <span class="task-date">
              Created: {{ formatDate(task.createdAt) }}
            </span>
            <span *ngIf="task.updatedAt !== task.createdAt" class="task-date">
              Updated: {{ formatDate(task.updatedAt) }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="task-actions">
        <button 
          class="btn btn-danger btn-sm"
          (click)="onDelete()"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 15px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      margin-bottom: 10px;
      background: white;
      transition: all 0.2s ease;
    }

    .task-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .task-item.completed {
      background-color: #f8f9fa;
      border-color: #28a745;
    }

    .task-content {
      display: flex;
      align-items: flex-start;
      flex: 1;
      gap: 12px;
    }

    .task-checkbox {
      position: relative;
      margin-top: 2px;
    }

    .task-checkbox input[type="checkbox"] {
      opacity: 0;
      position: absolute;
    }

    .checkbox-label {
      display: block;
      width: 20px;
      height: 20px;
      border: 2px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }

    .task-checkbox input[type="checkbox"]:checked + .checkbox-label {
      background-color: #28a745;
      border-color: #28a745;
    }

    .task-checkbox input[type="checkbox"]:checked + .checkbox-label::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .task-details {
      flex: 1;
    }

    .task-title {
      font-weight: 500;
      color: #333;
      margin-bottom: 5px;
      line-height: 1.4;
    }

    .task-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .completed-text {
      text-decoration: line-through;
      opacity: 0.7;
    }

    .task-meta {
      font-size: 12px;
      color: #999;
    }

    .task-date {
      margin-right: 15px;
    }

    .task-actions {
      display: flex;
      gap: 5px;
    }

    .btn {
      padding: 5px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .btn-sm {
      padding: 4px 6px;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    @media (max-width: 576px) {
      .task-item {
        padding: 12px;
      }
      
      .task-content {
        gap: 10px;
      }
      
      .task-title {
        font-size: 14px;
      }
      
      .task-description {
        font-size: 13px;
      }
    }
  `]
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  onToggleComplete(): void {
    if (this.task.id) {
      this.toggleComplete.emit(this.task.id);
    }
  }

  onDelete(): void {
    if (this.task.id && confirm('Are you sure you want to delete this task?')) {
      this.deleteTask.emit(this.task.id);
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    
    const taskDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - taskDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return taskDate.toLocaleDateString();
    }
  }
}