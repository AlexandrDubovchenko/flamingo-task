import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { ProjectsService } from '../projects/projects.service';
import { TASK_REPOSITORY } from './task.tokens';
import { type TaskRepository } from './task.repository';
import { Task, TaskPriority, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    private projectsService: ProjectsService,
  ) {}

  async findAllByUser(userId: number): Promise<Task[]> {
    return await this.taskRepository.findAllByUserId(userId);
  }

  async findAllByProject(projectId: number, userId: number): Promise<Task[]> {
    // Verify project belongs to user
    await this.projectsService.findOne(projectId, userId);

    return await this.taskRepository.findAllByProjectId(projectId, userId);
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findByIdAndUserId(id, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    // Verify project belongs to user
    await this.projectsService.findOne(createTaskDto.projectId, userId);

    const task = Task.create(
      createTaskDto.title,
      createTaskDto.projectId,
      userId,
      createTaskDto.description,
      createTaskDto.status as TaskStatus,
      createTaskDto.priority as TaskPriority,
      createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
    );

    return await this.taskRepository.create(task);
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    // First check if task exists and belongs to user
    const existingTask = await this.findOne(id, userId);

    // If updating project, verify new project belongs to user
    if (updateTaskDto.projectId) {
      await this.projectsService.findOne(updateTaskDto.projectId, userId);
    }

    const updatedTask = existingTask.update(
      updateTaskDto.title,
      updateTaskDto.description,
      updateTaskDto.status as TaskStatus,
      updateTaskDto.priority as TaskPriority,
      updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
      updateTaskDto.projectId,
    );

    return await this.taskRepository.update(updatedTask);
  }

  async remove(id: number, userId: number): Promise<void> {
    // First check if task exists and belongs to user
    await this.findOne(id, userId);

    await this.taskRepository.delete(id, userId);
  }
}
