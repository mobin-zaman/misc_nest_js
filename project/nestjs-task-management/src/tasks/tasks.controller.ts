import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, Delete, Patch, Query, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService) { }


    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user:User): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retriving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number,
    @GetUser() user:User
    ): Promise<Task> {
        console.log('came tooler');
        return this.tasksService.getTaskById(id,user);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user:User
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} create a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    // @Delete('/:id')
    // deleteTask(@Param('id') id: string): void {
    //     this.tasksService.deleteTask(id);
    // }

    @Patch(':/id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user:User,
    ): Task {
        return this.tasksService.updateTaskStatus(id, status,user);
    }


}
