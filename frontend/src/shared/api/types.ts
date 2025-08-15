export interface UserApiResponse {
  id: number
  auth0Id: string
  email: string
  name: string
  picture?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectApiResponse {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: string
  updatedAt: string
}

export interface TaskApiResponse {
  id: number
  title: string
  description?: string
  status: string
  priority: string
  projectId: number
  assigneeId?: number
  dueDate?: string
  createdAt: string
  updatedAt: string
}
