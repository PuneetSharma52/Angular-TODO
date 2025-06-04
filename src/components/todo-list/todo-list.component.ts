import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { Todo } from '../../models/todo.model';
import { TodoFilterComponent, FilterType } from '../todo-filter/todo-filter.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule, 
    TodoFormComponent, 
    TodoItemComponent, 
    PaginationComponent,
    TodoFilterComponent
  ],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Todo App</h1>
      
      <app-todo-form (todoAdded)="resetPagination()"></app-todo-form>
      
      <app-todo-filter 
        [currentFilter]="currentFilter"
        (filterChange)="onFilterChange($event)"
      ></app-todo-filter>
      
      <div *ngIf="filteredTodos.length > 0; else emptyState">
        <app-todo-item
          *ngFor="let todo of paginatedTodos"
          [todo]="todo"
          (toggleComplete)="onToggleComplete($event)"
          (delete)="onDelete($event)"
          class="block mb-3"
        ></app-todo-item>
        
        <app-pagination
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [totalItems]="filteredTodos.length"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
      
      <ng-template #emptyState>
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-lg text-gray-600 mb-1">No tasks found</p>
          <p class="text-sm text-gray-500">
            {{ getEmptyStateMessage() }}
          </p>
        </div>
      </ng-template>
    </div>
  `,
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  paginatedTodos: Todo[] = [];
  currentPage = 1;
  pageSize = 5;
  currentFilter: FilterType = 'all';
  
  constructor(private todoService: TodoService) {}
  
  ngOnInit(): void {
    this.todoService.todos$.subscribe(todos => {
      this.todos = todos;
      this.applyFilter();
      this.applyPagination();
    });
  }
  
  onToggleComplete(id: string): void {
    this.todoService.toggleTodoComplete(id);
  }
  
  onDelete(id: string): void {
    this.todoService.deleteTodo(id);
    
    // If we delete the last item on the current page, go to the previous page
    if (this.paginatedTodos.length === 1 && this.currentPage > 1) {
      this.currentPage--;
    }
    
    this.applyFilter();
    this.applyPagination();
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  onFilterChange(filter: FilterType): void {
    this.currentFilter = filter;
    this.resetPagination();
  }
  
  resetPagination(): void {
    this.currentPage = 1;
    this.applyFilter();
    this.applyPagination();
  }
  
  applyFilter(): void {
    switch (this.currentFilter) {
      case 'active':
        this.filteredTodos = this.todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        this.filteredTodos = this.todos.filter(todo => todo.completed);
        break;
      case 'all':
      default:
        this.filteredTodos = [...this.todos];
        break;
    }
  }
  
  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedTodos = this.filteredTodos.slice(startIndex, startIndex + this.pageSize);
  }
  
  getEmptyStateMessage(): string {
    switch (this.currentFilter) {
      case 'active':
        return 'You have no active tasks. All your tasks are completed!';
      case 'completed':
        return 'You have no completed tasks yet.';
      case 'all':
      default:
        return 'Add a new task to get started!';
    }
  }
}