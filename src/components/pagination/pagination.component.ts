import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ startIndex + 1 }}</span>
        to
        <span class="font-medium">{{ endIndex }}</span>
        of
        <span class="font-medium">{{ totalItems }}</span>
        results
      </div>
      
      <div class="flex gap-1">
        <button
          (click)="onPrevious()"
          [disabled]="currentPage === 1"
          [class.opacity-50]="currentPage === 1"
          [class.cursor-not-allowed]="currentPage === 1"
          class="pagination-btn pagination-btn-inactive"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <ng-container *ngFor="let page of visiblePages">
          <button
            *ngIf="page !== '...'"
            (click)="onPageChange(+page)"
            [class.pagination-btn-active]="currentPage === +page"
            [class.pagination-btn-inactive]="currentPage !== +page"
            class="pagination-btn"
          >
            {{ page }}
          </button>
          
          <span *ngIf="page === '...'" class="pagination-btn flex items-center justify-center">
            {{ page }}
          </span>
        </ng-container>
        
        <button
          (click)="onNext()"
          [disabled]="currentPage === totalPages"
          [class.opacity-50]="currentPage === totalPages"
          [class.cursor-not-allowed]="currentPage === totalPages"
          class="pagination-btn pagination-btn-inactive"
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 5;
  @Input() totalItems = 0;
  @Output() pageChange = new EventEmitter<number>();
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  
  get endIndex(): number {
    const end = this.startIndex + this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }
  
  get visiblePages(): (string | number)[] {
    const delta = 1; // Number of pages to show before and after current page
    const pages: (string | number)[] = [];
    
    if (this.totalPages <= 5) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      const firstPage = 1;
      const lastPage = this.totalPages;
      
      // Calculate range around current page
      const leftBound = Math.max(firstPage, this.currentPage - delta);
      const rightBound = Math.min(lastPage, this.currentPage + delta);
      
      // Add first page
      pages.push(firstPage);
      
      // Add ellipsis if needed
      if (leftBound > firstPage + 1) {
        pages.push('...');
      } else if (leftBound === firstPage + 1) {
        pages.push(firstPage + 1);
      }
      
      // Add pages around current page (if not already added)
      for (let i = leftBound; i <= rightBound; i++) {
        if (i !== firstPage && i !== lastPage) {
          pages.push(i);
        }
      }
      
      // Add ellipsis if needed
      if (rightBound < lastPage - 1) {
        pages.push('...');
      } else if (rightBound === lastPage - 1) {
        pages.push(lastPage - 1);
      }
      
      // Add last page
      pages.push(lastPage);
    }
    
    return pages;
  }
  
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
  
  onPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }
  
  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}