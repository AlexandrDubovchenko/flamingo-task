import { apiClient } from './client';
import type { ApiResponse } from './client';
import { API_ENDPOINTS } from '@/shared/config/api';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/models';

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      API_ENDPOINTS.TASKS
    );
    return response.data.data;
  },
  getAllByProjectId: async (id: number): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      API_ENDPOINTS.TASKS,
      {
        params: { projectId: id },
      }
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(
      `${API_ENDPOINTS.TASKS}/${id}`
    );
    return response.data.data;
  },

  create: async (taskData: CreateTaskDto): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>(
      API_ENDPOINTS.TASKS,
      taskData
    );
    return response.data.data;
  },

  update: async (id: number, taskData: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `${API_ENDPOINTS.TASKS}/${id}`,
      taskData
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.TASKS}/${id}`);
  },
};
