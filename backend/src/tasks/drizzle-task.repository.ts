import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { type DatabaseType, taskEntities, TaskEntity } from 'src/database';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { TaskRepository } from './task.repository';
import { Task, TaskPriority, TaskStatus } from './task.model';

@Injectable()
export class DrizzleTaskRepository implements TaskRepository {
  constructor(@Inject(DATABASE_CONNECTION) private db: DatabaseType) {}

  async findById(id: number): Promise<Task | null> {
    const result = await this.db
      .select()
      .from(taskEntities)
      .where(eq(taskEntities.id, id))
      .limit(1);

    return result[0] ? this.entityToDomain(result[0]) : null;
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Task | null> {
    const result = await this.db
      .select()
      .from(taskEntities)
      .where(and(eq(taskEntities.id, id), eq(taskEntities.userId, userId)))
      .limit(1);

    return result[0] ? this.entityToDomain(result[0]) : null;
  }

  async findAllByUserId(userId: number): Promise<Task[]> {
    const result = await this.db
      .select()
      .from(taskEntities)
      .where(eq(taskEntities.userId, userId));

    return result.map((entity) => this.entityToDomain(entity));
  }

  async findAllByProjectId(projectId: number, userId: number): Promise<Task[]> {
    const result = await this.db
      .select()
      .from(taskEntities)
      .where(
        and(
          eq(taskEntities.projectId, projectId),
          eq(taskEntities.userId, userId),
        ),
      );

    return result.map((entity) => this.entityToDomain(entity));
  }

  async create(task: Task): Promise<Task> {
    if (!task.isNew()) {
      throw new Error('Cannot create task that already has an ID');
    }

    const result = await this.db
      .insert(taskEntities)
      .values({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        userId: task.userId,
        updatedAt: new Date(),
      })
      .returning();

    return this.entityToDomain(result[0]);
  }

  async update(task: Task): Promise<Task> {
    if (task.isNew()) {
      throw new Error('Cannot update task without an ID');
    }

    const result = await this.db
      .update(taskEntities)
      .set({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(taskEntities.id, task.id as number),
          eq(taskEntities.userId, task.userId),
        ),
      )
      .returning();

    return this.entityToDomain(result[0]);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.db
      .delete(taskEntities)
      .where(and(eq(taskEntities.id, id), eq(taskEntities.userId, userId)));
  }

  private entityToDomain(entity: TaskEntity): Task {
    return new Task(
      entity.id,
      entity.title,
      entity.description,
      entity.status as TaskStatus,
      entity.priority as TaskPriority,
      entity.dueDate,
      entity.projectId,
      entity.userId,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
