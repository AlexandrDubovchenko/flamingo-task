import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { DrizzleTaskRepository } from './drizzle-task.repository';
import { TASK_REPOSITORY } from './task.tokens';

@Module({
  imports: [UsersModule, ProjectsModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TASK_REPOSITORY,
      useClass: DrizzleTaskRepository,
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}
