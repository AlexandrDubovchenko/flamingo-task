export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus]

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority]

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId: number
  userId?: number
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId: number
  assigneeId?: number
  dueDate?: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: number
  dueDate?: string
}
