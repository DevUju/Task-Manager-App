import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../shared/models/task';
import { Observable } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, CommonModule],
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.css']
})
export class TaskDetail implements OnInit {
  task$!: Observable<Task | undefined>;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.task$ = this.taskService.getTaskById(id);
  }
}