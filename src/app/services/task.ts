import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Task } from '../shared/models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) { }


  getTasks(): void {
    this.http.get<Task[]>(this.apiUrl)
      .pipe(
        map(tasks => tasks.map(task => ({
          ...task,
          completed: !!task.completed,
          createdAt: task.createdAt || new Date().toISOString(),
          dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })))
      )
      .subscribe(tasks => this.tasksSubject.next(tasks));
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }


  addTask(task: Task): void {
    this.http.post<Task>(this.apiUrl, task)
      .pipe(
        tap(savedTask => {
          const updatedTasks = [...this.tasksSubject.value, savedTask];
          this.tasksSubject.next(updatedTasks);
        })
      )
      .subscribe();
  }

  markTaskCompleted(id: number): void {
    this.http.patch<Task>(`${this.apiUrl}/${id}`, { completed: true })
      .pipe(
        tap(() => {
          const updatedTasks = this.tasksSubject.value.filter(task => task.id !== id);
          this.tasksSubject.next(updatedTasks);
        })
      )
      .subscribe();
  }
}