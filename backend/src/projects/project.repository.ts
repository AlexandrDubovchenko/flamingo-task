import { Project } from './project.model';

export interface ProjectRepository {
  findById(id: number): Promise<Project | null>;
  findByIdAndUserId(id: number, userId: number): Promise<Project | null>;
  findAllByUserId(userId: number): Promise<Project[]>;
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(id: number, userId: number): Promise<void>;
}
