import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TodoListComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-todo-list></app-todo-list>
    </div>
  `,
})
export class App {
  name = 'Todo App';
}

bootstrapApplication(App);