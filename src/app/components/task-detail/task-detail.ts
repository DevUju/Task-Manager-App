import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task';
import { Task } from '../../shared/models/task';
import { Observable } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.css']
})
export class TaskDetail implements OnInit {
  task$!: Observable<Task | undefined>;
  task = signal<Task | undefined>(undefined);
  isEditing = false;
  editedTask: Partial<Task> = {};

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.taskService.getTasks();
    
    this.task$ = this.taskService.getTaskById(id);
    this.task$.subscribe(taskData => {
      this.task.set(taskData);
      if (taskData) {
        this.editedTask = { ...taskData };
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveTask(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.updateTask(id, this.editedTask);
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.task$.subscribe(task => {
      if (task) {
        this.editedTask = { ...task };
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}