import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersModule } from '../users/users.module';
import { DrizzleProjectRepository } from './drizzle-project.repository';
import { PROJECT_REPOSITORY } from './project.tokens';

@Module({
  imports: [UsersModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    {
      provide: PROJECT_REPOSITORY,
      useClass: DrizzleProjectRepository,
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
