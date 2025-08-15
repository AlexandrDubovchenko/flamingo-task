import { apiClient } from './client'
import type { ApiResponse } from './client'
import { API_ENDPOINTS } from '@/shared/config/api'
import type { User, CreateUserDto, UpdateUserDto } from '@/models'

export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/profile`)
    return response.data.data
  },

  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(API_ENDPOINTS.USERS, userData)
    return response.data.data
  },

  updateUser: async (id: number, userData: UpdateUserDto): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`, userData)
    return response.data.data
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`)
  },
}
