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
  completingTasks: Set<number> = new Set();
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
      this.tasks = tasks;
    });
  }

  addTask(): void {
    const uniqueId = Date.now().toString();
    
    const taskToAdd = {
      ...this.newTask, 
      id: uniqueId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    this.taskService.addTask(taskToAdd);
    
    this.newTask.title = '';
    this.newTask.description = '';
    
    setTimeout(() => {
      this.taskService.getTasks();
    }, 500);
  }

  markCompleted(id: number): void {
    if (this.completingTasks.has(id)) {
      return;
    }
    this.completingTasks.add(id);    
    this.taskService.markTaskCompleted(id);
    
    setTimeout(() => {
      this.completingTasks.delete(id);
      this.taskService.getTasks();
    }, 1000);
  }
}