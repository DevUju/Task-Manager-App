import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../shared/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {
    id: Date.now(),
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    completed: false
  };

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks();
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks.filter(t => !t.completed);
    });
  }

  addTask(): void {
    this.taskService.addTask({ ...this.newTask, id: Date.now() });
    this.newTask.title = '';
    this.newTask.description = '';
  }

  markCompleted(id: number): void {
  this.taskService.markTaskCompleted(id);
}
}