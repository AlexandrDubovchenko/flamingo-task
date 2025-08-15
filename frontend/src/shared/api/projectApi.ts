import { apiClient } from './client';
import type { ApiResponse } from './client';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/models';

export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>(
      API_ENDPOINTS.PROJECTS
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(
      `${API_ENDPOINTS.PROJECTS}/${id}`
    );
    return response.data.data;
  },

  create: async (projectData: CreateProjectDto): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      API_ENDPOINTS.PROJECTS,
      projectData
    );
    return response.data.data;
  },

  update: async (
    id: number,
    projectData: UpdateProjectDto
  ): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(
      `${API_ENDPOINTS.PROJECTS}/${id}`,
      projectData
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
  },
};
