import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasKfilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController')
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto:GetTasKfilterDto,
  @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all task . Filters: ${JSON.stringify(filterDto)}`)
    return this.tasksService.GetTask(filterDto,user)
  }


  @Get('/:id')
  getTaskById(@Param('id') id:string, @GetUser() user: User):Promise<Task>{
    return this.tasksService.getTaskById(id,user);
  }
  

  @Post()
  createTask(@Body() CreateTaskDto: CreateTaskDto,
  @GetUser() user: User):Promise<Task> {
    return this.tasksService.createTask(CreateTaskDto,user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string,
  @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTaskById(id,user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto:UpdateTaskStatusDto,
    @GetUser() user: User
  ): Promise<Task> {
    const {status}=updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
