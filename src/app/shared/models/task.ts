export interface Task {
  id: number | string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;    
  createdAt: string;   
  completed?: boolean;  
}
