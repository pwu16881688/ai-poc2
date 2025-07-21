import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task, TaskStats } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.getAllTasks().subscribe({
      next: (tasks) => this.tasksSubject.next(tasks),
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, this.httpOptions)
      .pipe(
        tap(() => this.loadTasks())
      );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, this.httpOptions)
      .pipe(
        tap(() => this.loadTasks())
      );
  }

  toggleTaskCompletion(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {}, this.httpOptions)
      .pipe(
        tap(() => this.loadTasks())
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.loadTasks())
      );
  }

  getTasksByStatus(completed: boolean): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${completed}`);
  }

  getTaskStats(): Observable<TaskStats> {
    return this.http.get<TaskStats>(`${this.apiUrl}/stats`);
  }

  refreshTasks(): void {
    this.loadTasks();
  }
}