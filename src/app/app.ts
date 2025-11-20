import { Component, signal, inject, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { ExerciseSelectorComponent } from './exercise-selector/exercise-selector';
import { WorkoutBuilder } from './workout-builder/workout-builder';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise } from './Exercise';
import { Block } from './workout-builder/block';
import { MatIcon } from '@angular/material/icon';
import { MatStep, MatStepper, MatStepperIcon } from '@angular/material/stepper';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ExerciseSelectorComponent,
    WorkoutBuilder,
    MatIcon,
    MatStep,
    MatStepper,
    MatStepperIcon,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected readonly title = signal('garmin_workout_generator');
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  selectedExercise = signal<Exercise | undefined>(undefined);
  currentWorkout = signal<Block[]>([]);

  @ViewChild('stepper') stepper!: MatStepper;

  ngAfterViewInit(): void {
    // Set initial step based on current route
    this.syncStepperFromUrl(this.router.url);

    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.syncStepperFromUrl(event.url);
      }
    });
  }

  private syncStepperFromUrl(url: string): void {
    if (!this.stepper) return;
    if (url.includes('exercises')) {
      this.stepper.selectedIndex = 0;
    } else if (url.includes('workout')) {
      this.stepper.selectedIndex = 1;
    }
  }

  onStepChange(event: any): void {
    const index = event.selectedIndex;
    if (index === 0) {
      this.router.navigate(['/exercises']);
    } else if (index === 1) {
      this.router.navigate(['/workout']);
    }
  }

  onExerciseSelected(exercise: Exercise): void {
    this.selectedExercise.set(exercise);
    this._snackBar.open('Added to workout: ' + exercise.Name);
  }
}
