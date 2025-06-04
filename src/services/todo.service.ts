import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'angular_todos';
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  
  todos$ = this.todosSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedTodos = localStorage.getItem(this.STORAGE_KEY);
    if (storedTodos) {
      try {
        this.todos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        this.todosSubject.next([...this.todos]);
      } catch (error) {
        console.error('Error parsing todos from localStorage:', error);
        this.todos = [];
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
  }

  getTodos(): Todo[] {
    return [...this.todos];
  }

  addTodo(title: string, description?: string): void {
    const newTodo: Todo = {
      id: this.generateId(),
      title: title.trim(),
      description: description?.trim(),
      completed: false,
      createdAt: new Date()
    };

    this.todos = [newTodo, ...this.todos];
    this.todosSubject.next([...this.todos]);
    this.saveToLocalStorage();
  }

  toggleTodoComplete(id: string): void {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    
    this.todosSubject.next([...this.todos]);
    this.saveToLocalStorage();
  }

  updateTodo(id: string, title: string, description?: string): void {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return { 
          ...todo, 
          title: title.trim(),
          description: description?.trim()
        };
      }
      return todo;
    });
    
    this.todosSubject.next([...this.todos]);
    this.saveToLocalStorage();
  }

  deleteTodo(id: string): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.todosSubject.next([...this.todos]);
    this.saveToLocalStorage();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}