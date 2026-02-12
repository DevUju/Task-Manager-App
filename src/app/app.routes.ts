import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { TaskList } from './components/task-list/task-list';
import { TaskDetail } from './components/task-detail/task-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'tasks', component: TaskList },
  { path: 'tasks/:id', component: TaskDetail },
  { path: '**', redirectTo: '' }
];
