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
          id: String(task.id),
          completed: !!task.completed,
          createdAt: task.createdAt || new Date().toISOString(),
          dueDate: task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })))
      )
      .subscribe(tasks => this.tasksSubject.next(tasks));
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => {
        const foundTask = tasks.find(task => task.id.toString() === id.toString());
        return foundTask;
      })
    );
  }


  addTask(task: Task): void {
    const stringIdTask: Task = { ...task, id: String(task.id) };
    const updatedTasks = [...this.tasksSubject.value, stringIdTask];
    this.tasksSubject.next(updatedTasks);
    
    this.http.post<Task>(this.apiUrl, stringIdTask).subscribe({
      next: (savedTask) => {
        const normalizedSavedTask = { ...savedTask, id: String(savedTask.id) };
        const finalTasks = this.tasksSubject.value.map(t => 
          t.id.toString() === stringIdTask.id.toString() ? normalizedSavedTask : t
        );
        this.tasksSubject.next(finalTasks);
        this.getTasks();
      },
      error: (error) => {
        const revertedTasks = this.tasksSubject.value.filter(t => t.id.toString() !== stringIdTask.id.toString());
        this.tasksSubject.next(revertedTasks);
      }
    });
  }

  markTaskCompleted(id: number): void {
    
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task => 
      task.id.toString() === id.toString() ? { ...task, completed: true } : task
    );
    this.tasksSubject.next(updatedTasks);
    
    const task = currentTasks.find(t => t.id.toString() === id.toString());
    if (task) {
      this.http.patch<Task>(`${this.apiUrl}/${String(task.id)}`, { completed: true })
        .subscribe({
          next: (response) => {
            this.getTasks();
          },
          error: (patchError) => {
          }
        });
    }
  }

  updateTask(id: number, updates: Partial<Task>): void {
    const task = this.tasksSubject.value.find(t => t.id.toString() === id.toString());
    if (task) {
      const updatedTask = { ...task, ...updates };
      const updatedTasks = this.tasksSubject.value.map(t => 
        t.id.toString() === id.toString() ? updatedTask : t
      );
      this.tasksSubject.next(updatedTasks);
      
      this.http.patch<Task>(`${this.apiUrl}/${String(task.id)}`, updates)
        .subscribe({
          next: (response) => {
          },
          error: (patchError) => {
          }
        });
    }
  }
}