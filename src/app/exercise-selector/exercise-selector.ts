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
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { CdkTrapFocus } from '@angular/cdk/a11y';

interface FilterOption {
  label: string;
  // Non-numeric (categorical) filter values
  values?: string[];
  selectedValues?: string[];
  // Numeric filter metadata
  isNumeric?: boolean;
  min?: number;
  max?: number;
  start?: number; // current range start
  end?: number; // current range end
  // Binary shortcut (0/1) — used primarily for equipment toggles
  isBinary?: boolean;
  binaryState?: 'any' | 'yes' | 'no';
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
    MatSliderModule,
    MatButtonToggleModule,
    FormsModule,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatAccordion,
    MatButton,
    CdkTrapFocus,
  ],
  templateUrl: './exercise-selector.html',
  styleUrls: ['./exercise-selector.scss'],
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
      let isNumeric = true;
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      const valuesSet = new Set<string>();

      this.allExercises.forEach((exercise) => {
        const value = (exercise as any)[column];
        if (value === null || value === undefined || value === '') return;

        if (typeof value === 'number') {
          if (value < min) min = value;
          if (value > max) max = value;
        } else {
          isNumeric = false;
          if (typeof value === 'boolean') {
            valuesSet.add(value.toString());
          } else if (typeof value === 'string') {
            valuesSet.add(value);
          } else if (typeof value === 'object') {
            valuesSet.add(JSON.stringify(value));
          }
        }
      });

      if (isNumeric && isFinite(min) && isFinite(max)) {
        const isBinary = min === 0 && max === 1;
        this.filters[column] = {
          label: this.formatColumnName(column),
          isNumeric: true,
          min,
          max,
          start: min,
          end: max,
          ...(isBinary ? { isBinary: true, binaryState: 'any' } : {}),
        };
      } else {
        const uniqueValues = Array.from(valuesSet).sort();
        if (uniqueValues.length > 0) {
          this.filters[column] = {
            label: this.formatColumnName(column),
            values: uniqueValues,
            selectedValues: [],
          };
        }
      }
    });
  }

  formatColumnName(columnName: string): string {
    // Strip common prefixes for display only
    const stripped = columnName.replace(/^(MUSCLE_|EQUIPMENT_)/, '');
    return stripped.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  applyFilters(): void {
    this.filteredExercises = this.allExercises.filter((exercise) => {
      // Check all filters
      for (const column of this.filterableColumns) {
        const filter = this.filters[column];
        if (!filter) continue;

        const exerciseValue = (exercise as any)[column];

        if (filter.isNumeric) {
          const valueNum =
            typeof exerciseValue === 'number' ? exerciseValue : Number(exerciseValue);

          // Binary 0/1 shortcut via tri-state toggles
          if (filter.isBinary) {
            const state = filter.binaryState ?? 'any';
            if (state === 'yes' && valueNum !== 1) return false;
            if (state === 'no' && valueNum !== 0) return false;
            // 'any' imposes no constraint
          } else {
            // Generic numeric range
            const start = filter.start ?? filter.min ?? Number.NEGATIVE_INFINITY;
            const end = filter.end ?? filter.max ?? Number.POSITIVE_INFINITY;
            if (Number.isFinite(valueNum)) {
              if (valueNum < start || valueNum > end) return false;
            }
            // if not finite, ignore numeric filter for this value
          }
        } else if (filter.selectedValues && filter.selectedValues.length > 0) {
          let valueStr: string;
          if (typeof exerciseValue === 'object' && exerciseValue !== null) {
            valueStr = JSON.stringify(exerciseValue);
          } else {
            valueStr = String(exerciseValue);
          }
          if (!filter.selectedValues.includes(valueStr)) {
            return false;
          }
        }
      }

      const nameFilter = this.filterName.trim().toLowerCase();
      if (nameFilter == '') {
        return true;
      }
      return exercise.Name.toLowerCase().includes(nameFilter);
    });
    this.pageIndex = 0;
  }

  clearFilters(): void {
    Object.keys(this.filters).forEach((key) => {
      const f = this.filters[key];
      if (f.isNumeric) {
        if (f.isBinary) {
          f.binaryState = 'any';
        }
        f.start = f.min;
        f.end = f.max;
      } else if (f.selectedValues) {
        f.selectedValues = [];
      }
    });
    this.applyFilters();
  }

  isNumericColumn(column: string): boolean {
    const f = this.filters[column];
    return !!f && !!f.isNumeric;
  }

  setNumericRange(column: string, which: 'start' | 'end', value: number): void {
    const f = this.filters[column];
    if (!f || !f.isNumeric) return;
    const min = f.min ?? Number.NEGATIVE_INFINITY;
    const max = f.max ?? Number.POSITIVE_INFINITY;
    const v = Math.min(Math.max(value, min), max);

    if (which === 'start') {
      f.start = v;
      if ((f.end ?? max) < v) {
        f.end = v;
      }
    } else {
      f.end = v;
      if ((f.start ?? min) > v) {
        f.start = v;
      }
    }
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
