export interface Project {
  id: number
  name: string
  description?: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  name: string
  description?: string
  color?: string
}

export interface UpdateProjectDto {
  name?: string
  description?: string
}
