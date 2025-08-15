import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { UsersService } from '../users/users.service';
import type { RequestWithUser } from 'src/common/request-with-user';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(
    @Req() req: RequestWithUser,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(createTaskDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks by project or all tasks for user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiQuery({
    name: 'projectId',
    required: false,
    description: 'Filter tasks by project ID',
  })
  async findAll(
    @Req() req: RequestWithUser,
    @Query('projectId') projectId?: string,
  ) {
    if (projectId) {
      return this.tasksService.findAllByProject(
        parseInt(projectId, 10),
        req.user.sub,
      );
    }

    return this.tasksService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  async findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.tasksService.findOne(parseInt(id, 10), req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      parseInt(id, 10),
      updateTaskDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.tasksService.remove(parseInt(id, 10), req.user.sub);
    return { message: 'Task deleted successfully' };
  }
}
