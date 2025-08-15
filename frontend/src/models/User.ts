export interface User {
  id: number
  auth0Id: string
  email: string
  name: string
  picture?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  auth0Id: string
  email: string
  name: string
  picture?: string
}

export interface UpdateUserDto {
  name?: string
  picture?: string
}
