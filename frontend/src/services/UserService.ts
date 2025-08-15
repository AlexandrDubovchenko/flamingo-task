import { userApi } from '@/shared/api'
import type { User, CreateUserDto, UpdateUserDto } from '@/models'

export class UserService {
  async getCurrentUser(): Promise<User> {
    try {
      const user = await userApi.getProfile()
      return this.mapUserResponse(user)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw new Error('Failed to fetch user profile')
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const user = await userApi.createUser(userData)
      return this.mapUserResponse(user)
    } catch (error) {
      console.error('Failed to create user:', error)
      throw new Error('Failed to create user')
    }
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    try {
      const user = await userApi.updateUser(id, userData)
      return this.mapUserResponse(user)
    } catch (error) {
      console.error('Failed to update user:', error)
      throw new Error('Failed to update user')
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await userApi.deleteUser(id)
    } catch (error) {
      console.error('Failed to delete user:', error)
      throw new Error('Failed to delete user')
    }
  }

  private mapUserResponse(rawUser: User): User {
    return {
      id: rawUser.id,
      auth0Id: rawUser.auth0Id,
      email: rawUser.email,
      name: rawUser.name,
      picture: rawUser.picture || undefined,
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
    }
  }
}

export const userService = new UserService()
