import { taskApi } from '@/shared/api'
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '@/models'

export class TaskService {
  async getAllTasks(): Promise<Task[]> {
    try {
      const tasks = await taskApi.getAll()
      return tasks.map(task => this.mapTaskResponse(task))
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      throw new Error('Failed to fetch tasks')
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const task = await taskApi.getById(id)
      return this.mapTaskResponse(task)
    } catch (error) {
      console.error('Failed to fetch task:', error)
      throw new Error('Failed to fetch task')
    }
  }

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      const task = await taskApi.create(taskData)
      return this.mapTaskResponse(task)
    } catch (error) {
      console.error('Failed to create task:', error)
      throw new Error('Failed to create task')
    }
  }

  async updateTask(id: number, taskData: UpdateTaskDto): Promise<Task> {
    try {
      const task = await taskApi.update(id, taskData)
      return this.mapTaskResponse(task)
    } catch (error) {
      console.error('Failed to update task:', error)
      throw new Error('Failed to update task')
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      await taskApi.delete(id)
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw new Error('Failed to delete task')
    }
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    try {
      const allTasks = await this.getAllTasks()
      return allTasks.filter(task => task.projectId === projectId)
    } catch (error) {
      console.error('Failed to fetch project tasks:', error)
      throw new Error('Failed to fetch project tasks')
    }
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    try {
      const allTasks = await this.getAllTasks()
      return allTasks.filter(task => task.status === status)
    } catch (error) {
      console.error('Failed to fetch tasks by status:', error)
      throw new Error('Failed to fetch tasks by status')
    }
  }

  private mapTaskResponse(rawTask: Task): Task {
    return {
      id: rawTask.id,
      title: rawTask.title,
      description: rawTask.description || undefined,
      status: rawTask.status,
      priority: rawTask.priority,
      projectId: rawTask.projectId,
      dueDate: rawTask.dueDate || undefined,
      createdAt: rawTask.createdAt,
      updatedAt: rawTask.updatedAt,
    }
  }
}

export const taskService = new TaskService()
