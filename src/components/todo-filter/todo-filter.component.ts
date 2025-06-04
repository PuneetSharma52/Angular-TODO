import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap gap-2 mb-4">
      <button 
        *ngFor="let filterOption of filterOptions"
        (click)="onFilterChange(filterOption.value)"
        [class.bg-primary-600]="currentFilter === filterOption.value"
        [class.text-white]="currentFilter === filterOption.value"
        [class.bg-gray-100]="currentFilter !== filterOption.value"
        [class.text-gray-700]="currentFilter !== filterOption.value"
        class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200"
      >
        {{ filterOption.label }}
      </button>
    </div>
  `,
})
export class TodoFilterComponent {
  @Input() currentFilter: FilterType = 'all';
  @Output() filterChange = new EventEmitter<FilterType>();
  
  filterOptions = [
    { label: 'All', value: 'all' as FilterType },
    { label: 'Active', value: 'active' as FilterType },
    { label: 'Completed', value: 'completed' as FilterType },
  ];
  
  onFilterChange(filter: FilterType): void {
    this.filterChange.emit(filter);
  }
}