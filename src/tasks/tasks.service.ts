import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './tasks-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasKfilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}


  async GetTask(filterDto:GetTasKfilterDto,user:User):Promise<Task[]>{
    return this.taskRepository.GetTasks(filterDto,user);
  }


  async getTaskById(id: String, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id,user } });
    if (!found) {
      throw new NotFoundException(`TASK BY "${id}" IS NOT FOUND`);
    }
    return found;
  }

  async deleteTaskById(id: string,user: User): Promise<void> {
    const result = await this.taskRepository.delete({id,user});

    if (result.affected === 0) {
      throw new NotFoundException(`TASK BY "${id}" IS NOT FOUND`);
    }
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto,user);
  }

  async updateTaskStatus(id: string, status: TaskStatus,user:User): Promise<Task> {
    const task = await this.getTaskById(id,user);
    task.status = status;

    await this.taskRepository.save(task);
    return task;
  }
}
