import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../shared/models/task';
import { TaskList } from '../task-list/task-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskList],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.taskService.getTasks();
    this.router.navigate(['/tasks']);
  }
}
