import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY } from './user.tokens';
import { User } from './user.model';
import { type UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.userRepository.findByAuth0Id(auth0Id);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(user: User): Promise<User> {
    return this.userRepository.create(user);
  }

  async findOrCreateByAuth0Id(auth0Id: string): Promise<User> {
    let user = await this.findByAuth0Id(auth0Id);

    if (!user) {
      const newUser = User.create(auth0Id, 'Unknown');
      user = await this.create(newUser);
    }

    return user;
  }

  async findOrCreate(user: User): Promise<User> {
    return this.findOrCreateByAuth0Id(user.auth0Id);
  }
}
