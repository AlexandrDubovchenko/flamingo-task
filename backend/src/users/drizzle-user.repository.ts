import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type DatabaseType, userEntities, UserEntity } from 'src/database';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import { UserRepository } from './user.repository';
import { User } from './user.model';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(@Inject(DATABASE_CONNECTION) private db: DatabaseType) {}

  async findById(id: number): Promise<User | null> {
    const result = await this.db
      .select()
      .from(userEntities)
      .where(eq(userEntities.id, id))
      .limit(1);

    return result[0] ? this.entityToDomain(result[0]) : null;
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(userEntities)
      .where(eq(userEntities.auth0Id, auth0Id))
      .limit(1);

    return result[0] ? this.entityToDomain(result[0]) : null;
  }

  async create(user: User): Promise<User> {
    if (!user.isNew()) {
      throw new Error('Cannot create user that already has an ID');
    }

    const result = await this.db
      .insert(userEntities)
      .values({
        auth0Id: user.auth0Id,
        name: user.name,
        updatedAt: new Date(),
      })
      .returning();

    return this.entityToDomain(result[0]);
  }

  private entityToDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.auth0Id,
      entity.name,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
