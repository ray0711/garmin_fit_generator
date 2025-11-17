import { ChangeDetectionStrategy, Component, inject, OnInit, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { Exercise } from '../Exercise';
import { MatButton } from '@angular/material/button';

interface FilterOption {
  label: string;
  values: string[];
  selectedValues: string[];
}

@Component({
  selector: 'app-exercise-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatAccordion,
    MatButton,
  ],
  templateUrl: './exercise-selector.html',
  styleUrls: ['./exercise-selector.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseSelectorComponent implements OnInit {
  http = inject(HttpClient);
  displayedColumns: string[] = ['CATEGORY_GARMIN', 'Name', 'DESCRIPTION', 'IMAGE'];
  allExercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];

  // Pagination
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  get pagedExercises(): Exercise[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredExercises.slice(start, start + this.pageSize);
  }

  // Dynamic filters
  filterName = '';
  filters: Record<string, FilterOption> = {};
  filterableColumns: string[] = [];

  // Always displayed columns (not filterable)
  staticColumns = ['IMAGE'];
  private resizingColumn: string | null = null;
  private startX = 0;
  private startWidth = 0;

  exerciseSelected = output<Exercise>();

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.http.get<Record<string, Exercise>>('Exercises.json').subscribe({
      next: (data) => {
        // Convert object to array
        this.allExercises = Object.values(data);
        this.filteredExercises = [...this.allExercises];
        this.pageIndex = 0;
        this.extractFilterOptions();
      },
      error: (error) => {
        console.error('Error loading exercises:', error);
      },
    });
  }

  extractFilterOptions(): void {
    if (this.allExercises.length === 0) return;

    // Get all columns from the first exercise
    const firstExercise = this.allExercises[0];
    const allColumns = Object.keys(firstExercise);

    // Filter out static columns and create filters for the rest
    this.filterableColumns = allColumns.filter((col) => !this.staticColumns.includes(col));

    this.filterableColumns.forEach((column) => {
      const valuesSet = new Set<string>();

      this.allExercises.forEach((exercise) => {
        const value = (exercise as any)[column];

        // Handle different value types
        if (value !== null && value !== undefined && value !== '') {
          if (typeof value === 'boolean') {
            valuesSet.add(value.toString());
          } else if (typeof value === 'number') {
            valuesSet.add(value.toString());
          } else if (typeof value === 'string') {
            valuesSet.add(value);
          } else if (typeof value === 'object') {
            // Handle objects (like IMAGE which might be {valueType: "IMAGE"})
            valuesSet.add(JSON.stringify(value));
          }
        }
      });

      // Only create filter if there are multiple unique values
      const uniqueValues = Array.from(valuesSet).sort();
      if (uniqueValues.length > 0) {
        this.filters[column] = {
          label: this.formatColumnName(column),
          values: uniqueValues,
          selectedValues: [],
        };
      }
    });
  }

  formatColumnName(columnName: string): string {
    return columnName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  applyFilters(): void {
    this.filteredExercises = this.allExercises.filter((exercise) => {
      // Check all filters
      for (const column of this.filterableColumns) {
        const filter = this.filters[column];
        if (!filter || filter.selectedValues.length === 0) continue;

        const exerciseValue = (exercise as any)[column];
        let valueStr: string;

        // Convert value to string for comparison
        if (typeof exerciseValue === 'object' && exerciseValue !== null) {
          valueStr = JSON.stringify(exerciseValue);
        } else {
          valueStr = String(exerciseValue);
        }

        // Check if the exercise value matches any selected filter value
        if (!filter.selectedValues.includes(valueStr)) {
          return false;
        }
      }

      return exercise.Name.toLowerCase().includes(this.filterName.toLowerCase());
    });
    this.pageIndex = 0;
  }

  clearFilters(): void {
    Object.keys(this.filters).forEach((key) => {
      this.filters[key].selectedValues = [];
    });
    this.applyFilters();
  }

  sortData(sort: Sort): void {
    const data = this.filteredExercises.slice();

    if (!sort.active || sort.direction === '') {
      this.filteredExercises = data;
      this.pageIndex = 0;
      return;
    }

    this.filteredExercises = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const aValue = (a as any)[sort.active];
      const bValue = (b as any)[sort.active];

      return this.compare(aValue, bValue, isAsc);
    });
    this.pageIndex = 0;
  }

  compare(a: any, b: any, isAsc: boolean): number {
    // Handle null/undefined
    if (a === null || a === undefined) return isAsc ? -1 : 1;
    if (b === null || b === undefined) return isAsc ? 1 : -1;

    // Convert to comparable values
    const aStr = typeof a === 'object' ? JSON.stringify(a) : String(a);
    const bStr = typeof b === 'object' ? JSON.stringify(b) : String(b);

    return (aStr < bStr ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getMuscleColumns(): string[] {
    return this.filterableColumns.filter((col) => col.startsWith('MUSCLE_'));
  }

  getEquipmentColumns(): string[] {
    return this.filterableColumns.filter((col) => col.startsWith('EQUIPMENT_'));
  }

  getOtherColumns(): string[] {
    return this.filterableColumns.filter(
      (col) => col.startsWith('CATEGORY_GARMIN') || col.startsWith('DIFFICULTY'),
    );
  }

  openExercise(exercise: Exercise) {
    if (exercise.URL === null || exercise.URL === undefined || exercise.URL === '') return;
    window.open(exercise.URL, '_blank');
  }

  onResizeStart(event: MouseEvent, column: string): void {
    event.preventDefault();
    this.resizingColumn = column;
    this.startX = event.pageX;

    const th = (event.target as HTMLElement).closest('th');
    if (th) {
      this.startWidth = th.offsetWidth;
    }

    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
  }

  private onResizeMove = (event: MouseEvent): void => {
    if (!this.resizingColumn) return;

    const diff = event.pageX - this.startX;
    const newWidth = this.startWidth + diff;

    if (newWidth >= 50) {
      // Minimum width
      const th = document.querySelector(`th[data-column="${this.resizingColumn}"]`) as HTMLElement;
      if (th) {
        th.style.width = `${newWidth}px`;
        th.style.minWidth = `${newWidth}px`;
        th.style.maxWidth = `${newWidth}px`;
      }
    }
  };

  private onResizeEnd = (): void => {
    this.resizingColumn = null;
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
  };

  add_exercise(exercise: Exercise) {
    this.exerciseSelected.emit(exercise);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
