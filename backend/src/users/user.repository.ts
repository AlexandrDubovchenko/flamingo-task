import { User } from './user.model';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByAuth0Id(auth0Id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
