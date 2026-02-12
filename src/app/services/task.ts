import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Task } from '../shared/models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks'
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) { }

  getTasks(): void {
    this.http.get<Task[]>(this.apiUrl)
      .pipe(
        map(tasks => tasks.map(task => ({
          ...task,
          completed: !!task.completed,
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Example due date
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
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, task]);
  }

  updateTask(id: number, updates: Partial<Task>): void {
    this.http.patch<Task>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap(updatedTask => {
          const updatedTasks = this.tasksSubject.value.map(task =>
            task.id === id ? updatedTask : task
          );
          this.tasksSubject.next(updatedTasks);
        })
      )
      .subscribe();
  }

  markTaskCompleted(id: number): void {
    const updatedTasks = this.tasksSubject.value.map(task =>
      task.id === id ? { ...task, completed: true } : task
    );
    this.tasksSubject.next(updatedTasks);
  }
}