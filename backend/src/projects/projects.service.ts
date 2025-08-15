import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PROJECT_REPOSITORY } from './project.tokens';
import { Project } from './project.model';
import { type ProjectRepository } from './project.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async findAllByUser(userId: number): Promise<Project[]> {
    return await this.projectRepository.findAllByUserId(userId);
  }

  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findByIdAndUserId(id, userId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const project = Project.create(
      createProjectDto.name,
      userId,
      createProjectDto.description,
    );

    return await this.projectRepository.create(project);
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    userId: number,
  ): Promise<Project> {
    // First check if project exists and belongs to user
    const existingProject = await this.findOne(id, userId);

    const updatedProject = existingProject.update(
      updateProjectDto.name,
      updateProjectDto.description,
    );

    return await this.projectRepository.update(updatedProject);
  }

  async remove(id: number, userId: number): Promise<void> {
    // First check if project exists and belongs to user
    await this.findOne(id, userId);

    await this.projectRepository.delete(id, userId);
  }
}
