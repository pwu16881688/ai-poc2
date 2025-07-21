export interface Task {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}