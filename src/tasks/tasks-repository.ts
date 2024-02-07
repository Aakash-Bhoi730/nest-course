import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status-enum';
import { GetTasKfilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger();
  async GetTasks(filterDto: GetTasKfilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch {
        this.logger.error(`Failed to get tasks for user "${user.username}"`)
      throw new InternalServerErrorException();
    }
  }

  async createTask(creatTaskTdo: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = creatTaskTdo;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }
}
