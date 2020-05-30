import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }

    async getTasks(filterDto: GetTaskFilterDto, user:User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto,user);
    }

    async getTaskById(id: number, user:User): Promise<Task> {
        console.log('came here as well');
        const found = await this.taskRepository.findOne({
            where: {id,userId: user.id}
        });

        console.log('found: ', found);

        if (!found) {
            console.log('Not found exception');
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user:User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User
        ): Promise<Task> {
            const task = await this.getTaskById(id,user);
            task.status = status;
            await task.save();
            return task;
        }
}
