import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { Task, TaskStats } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  template: `
    <div class="task-list-container">
      <div class="task-list-header">
        <h2>My Tasks</h2>
        <div *ngIf="stats" class="task-stats">
          <span class="stat-item">
            Total: <strong>{{ stats.totalTasks }}</strong>
          </span>
          <span class="stat-item">
            Completed: <strong>{{ stats.completedTasks }}</strong>
          </span>
          <span class="stat-item">
            Pending: <strong>{{ stats.pendingTasks }}</strong>
          </span>
        </div>
      </div>

      <div class="task-filters">
        <button 
          class="filter-btn"
          [class.active]="currentFilter === 'all'"
          (click)="setFilter('all')"
        >
          All Tasks ({{ tasks.length }})
        </button>
        <button 
          class="filter-btn"
          [class.active]="currentFilter === 'pending'"
          (click)="setFilter('pending')"
        >
          Pending ({{ getPendingTasks().length }})
        </button>
        <button 
          class="filter-btn"
          [class.active]="currentFilter === 'completed'"
          (click)="setFilter('completed')"
        >
          Completed ({{ getCompletedTasks().length }})
        </button>
      </div>

      <div class="task-list-content">
        <div *ngIf="loading" class="loading-message">
          Loading tasks...
        </div>

        <div *ngIf="!loading && filteredTasks.length === 0" class="empty-message">
          <div class="empty-icon">📝</div>
          <h3>{{ getEmptyMessage() }}</h3>
          <p>{{ getEmptySubMessage() }}</p>
        </div>

        <div *ngIf="!loading && filteredTasks.length > 0" class="tasks">
          <app-task-item
            *ngFor="let task of filteredTasks; trackBy: trackByTaskId"
            [task]="task"
            (toggleComplete)="onToggleComplete($event)"
            (deleteTask)="onDeleteTask($event)"
          ></app-task-item>
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        <strong>Error:</strong> {{ error }}
        <button class="btn btn-sm btn-outline" (click)="retryLoad()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .task-list-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .task-list-header h2 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .task-stats {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .stat-item {
      font-size: 14px;
      opacity: 0.9;
    }

    .task-filters {
      display: flex;
      border-bottom: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    .filter-btn {
      flex: 1;
      padding: 12px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      transition: all 0.2s ease;
      border-bottom: 3px solid transparent;
    }

    .filter-btn:hover {
      background: #e9ecef;
    }

    .filter-btn.active {
      color: #007bff;
      border-bottom-color: #007bff;
      background: white;
    }

    .task-list-content {
      min-height: 200px;
    }

    .tasks {
      padding: 20px;
    }

    .loading-message {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .empty-message {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-message h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .empty-message p {
      margin: 0;
      opacity: 0.8;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px 20px;
      border-top: 1px solid #f5c6cb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .btn {
      padding: 6px 12px;
      border: 1px solid;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .btn-outline {
      background: transparent;
      color: #721c24;
      border-color: #721c24;
    }

    .btn-outline:hover {
      background: #721c24;
      color: white;
    }

    @media (max-width: 576px) {
      .task-stats {
        gap: 15px;
      }
      
      .stat-item {
        font-size: 13px;
      }
      
      .filter-btn {
        padding: 10px 8px;
        font-size: 13px;
      }
      
      .tasks {
        padding: 15px;
      }
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  stats: TaskStats | null = null;
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  loading = true;
  error: string | null = null;

  private tasksSubscription?: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.tasksSubscription?.unsubscribe();
  }

  private loadTasks(): void {
    this.loading = true;
    this.error = null;

    this.tasksSubscription = this.taskService.tasks$.subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.error = 'Failed to load tasks. Please try again.';
        this.loading = false;
      }
    });
  }

  private loadStats(): void {
    this.taskService.getTaskStats().subscribe({
      next: (stats) => this.stats = stats,
      error: (error) => console.error('Error loading stats:', error)
    });
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  private applyFilter(): void {
    switch (this.currentFilter) {
      case 'pending':
        this.filteredTasks = this.getPendingTasks();
        break;
      case 'completed':
        this.filteredTasks = this.getCompletedTasks();
        break;
      default:
        this.filteredTasks = this.tasks;
    }
  }

  getPendingTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }

  getCompletedTasks(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

  onToggleComplete(taskId: number): void {
    this.taskService.toggleTaskCompletion(taskId).subscribe({
      next: () => {
        this.loadStats();
      },
      error: (error) => {
        console.error('Error toggling task completion:', error);
        this.error = 'Failed to update task. Please try again.';
      }
    });
  }

  onDeleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.loadStats();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.error = 'Failed to delete task. Please try again.';
      }
    });
  }

  retryLoad(): void {
    this.taskService.refreshTasks();
    this.loadStats();
  }

  trackByTaskId(index: number, task: Task): number | undefined {
    return task.id;
  }

  getEmptyMessage(): string {
    switch (this.currentFilter) {
      case 'pending':
        return 'No pending tasks';
      case 'completed':
        return 'No completed tasks';
      default:
        return 'No tasks yet';
    }
  }

  getEmptySubMessage(): string {
    switch (this.currentFilter) {
      case 'pending':
        return 'All tasks are completed!';
      case 'completed':
        return 'Complete some tasks to see them here.';
      default:
        return 'Add your first task to get started.';
    }
  }
}