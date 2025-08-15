import { Task } from './task.model';

export interface TaskRepository {
  findById(id: number): Promise<Task | null>;
  findByIdAndUserId(id: number, userId: number): Promise<Task | null>;
  findAllByUserId(userId: number): Promise<Task[]>;
  findAllByProjectId(projectId: number, userId: number): Promise<Task[]>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number, userId: number): Promise<void>;
}
