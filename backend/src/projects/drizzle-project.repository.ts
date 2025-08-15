import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { ProjectRepository } from './project.repository';
import {
  projectEntities,
  ProjectEntity,
  type DatabaseType,
} from 'src/database';
import { Project } from './project.model';

@Injectable()
export class DrizzleProjectRepository implements ProjectRepository {
  constructor(@Inject(DATABASE_CONNECTION) private db: DatabaseType) {}

  async findById(id: number): Promise<Project | null> {
    const result = await this.db
      .select()
      .from(projectEntities)
      .where(eq(projectEntities.id, id))
      .limit(1);

    return result[0] ? this.entityToDomain(result[0]) : null;
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Project | null> {
    const result = await this.db
      .select()
      .from(projectEntities)
      .where(
        and(eq(projectEntities.id, id), eq(projectEntities.userId, userId)),
      )
      .limit(1);

    return result[0] ? this.entityToDomain(result[0]) : null;
  }

  async findAllByUserId(userId: number): Promise<Project[]> {
    const result = await this.db
      .select()
      .from(projectEntities)
      .where(eq(projectEntities.userId, userId));

    return result.map((entity) => this.entityToDomain(entity));
  }

  async create(project: Project): Promise<Project> {
    if (!project.isNew()) {
      throw new Error('Cannot create project that already has an ID');
    }

    const result = await this.db
      .insert(projectEntities)
      .values({
        name: project.name,
        description: project.description,
        color: project.color,
        userId: project.userId,
        updatedAt: new Date(),
      })
      .returning();

    return this.entityToDomain(result[0]);
  }

  async update(project: Project): Promise<Project> {
    if (project.isNew()) {
      throw new Error('Cannot update project without an ID');
    }

    const result = await this.db
      .update(projectEntities)
      .set({
        name: project.name,
        description: project.description,
        color: project.color,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(projectEntities.id, project.id as number),
          eq(projectEntities.userId, project.userId),
        ),
      )
      .returning();

    return this.entityToDomain(result[0]);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.db
      .delete(projectEntities)
      .where(
        and(eq(projectEntities.id, id), eq(projectEntities.userId, userId)),
      );
  }

  private entityToDomain(entity: ProjectEntity): Project {
    return new Project(
      entity.id,
      entity.name,
      entity.description,
      entity.color ?? '#3B82F6',
      entity.userId,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
