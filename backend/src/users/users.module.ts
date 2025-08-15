import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleUserRepository } from './drizzle-user.repository';
import { USER_REPOSITORY } from './user.tokens';

@Module({
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
