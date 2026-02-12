import { Component, Output, EventEmitter } from '@angular/core';
import { Task } from '../../shared/models/task';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css']
})
export class TaskForm {
  newTask: Partial<Task> = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    createdAt: new Date().toISOString()
  };

  @Output() taskCreated = new EventEmitter<Task>();

  createTask() {
    if (this.newTask.title && this.newTask.dueDate) {
      const task: Task = {
        ...this.newTask,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString()
      } as Task;
      this.taskCreated.emit(task);
      this.newTask = {
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        createdAt: new Date().toISOString()
      };
    }
  }
}