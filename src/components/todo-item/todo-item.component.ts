import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todo-item card p-4 mb-3">
      <div class="flex items-start">
        <div class="flex-shrink-0 pt-1">
          <input 
            type="checkbox"
            [checked]="todo.completed"
            (change)="onToggleComplete()"
            class="checkbox"
          />
        </div>
        
        <div class="ml-3 flex-1">
          <div class="flex justify-between">
            <h3 
              class="text-lg font-medium"
              [class.line-through]="todo.completed"
              [class.text-gray-400]="todo.completed"
              [class.text-gray-800]="!todo.completed"
            >
              {{ todo.title }}
            </h3>
            
            <button 
              (click)="onDelete()"
              class="text-error-500 hover:text-error-700 transition-colors duration-200"
              aria-label="Delete todo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <p 
            *ngIf="todo.description" 
            class="mt-1 text-sm"
            [class.text-gray-400]="todo.completed"
            [class.text-gray-600]="!todo.completed"
          >
            {{ todo.description }}
          </p>
          
          <p class="mt-2 text-xs text-gray-500">
            Created: {{ todo.createdAt | date:'medium' }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  
  onToggleComplete(): void {
    this.toggleComplete.emit(this.todo.id);
  }
  
  onDelete(): void {
    this.delete.emit(this.todo.id);
  }
}