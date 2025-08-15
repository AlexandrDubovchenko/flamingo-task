import { projectApi } from '@/shared/api'
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/models'

export class ProjectService {
  async getAllProjects(): Promise<Project[]> {
    try {
      const projects = await projectApi.getAll()
      return projects.map(project => this.mapProjectResponse(project))
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      throw new Error('Failed to fetch projects')
    }
  }

  async getProjectById(id: number): Promise<Project> {
    try {
      const project = await projectApi.getById(id)
      return this.mapProjectResponse(project)
    } catch (error) {
      console.error('Failed to fetch project:', error)
      throw new Error('Failed to fetch project')
    }
  }

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    try {
      const project = await projectApi.create(projectData)
      return this.mapProjectResponse(project)
    } catch (error) {
      console.error('Failed to create project:', error)
      throw new Error('Failed to create project')
    }
  }

  async updateProject(id: number, projectData: UpdateProjectDto): Promise<Project> {
    try {
      const project = await projectApi.update(id, projectData)
      return this.mapProjectResponse(project)
    } catch (error) {
      console.error('Failed to update project:', error)
      throw new Error('Failed to update project')
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await projectApi.delete(id)
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw new Error('Failed to delete project')
    }
  }

  private mapProjectResponse(rawProject: Project): Project {
    return {
      id: rawProject.id,
      name: rawProject.name,
      description: rawProject.description || undefined,
      ownerId: rawProject.ownerId,
      createdAt: rawProject.createdAt,
      updatedAt: rawProject.updatedAt,
    }
  }
}

export const projectService = new ProjectService()
