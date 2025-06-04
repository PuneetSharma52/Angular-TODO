import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="mb-6 card p-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
      
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          [(ngModel)]="title"
          class="input"
          placeholder="What needs to be done?"
          required
          autofocus
        />
      </div>
      
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          [(ngModel)]="description"
          class="input h-20 resize-none"
          placeholder="Add details about this task..."
        ></textarea>
      </div>
      
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary" [disabled]="!title.trim()">
          Add Task
        </button>
      </div>
    </form>
  `,
})
export class TodoFormComponent {
  title = '';
  description = '';
  
  @Output() todoAdded = new EventEmitter<void>();
  
  constructor(private todoService: TodoService) {}
  
  onSubmit(): void {
    if (this.title.trim()) {
      this.todoService.addTodo(this.title, this.description);
      this.title = '';
      this.description = '';
      this.todoAdded.emit();
    }
  }
}