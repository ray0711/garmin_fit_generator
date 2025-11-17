import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FitControl } from './fit-control/fit-control';
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
    FitControl,
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
export class App {
  protected readonly title = signal('garmin_workout_generator');
  private _snackBar = inject(MatSnackBar);
  selectedExercise = signal<Exercise | undefined>(undefined);
  currentWorkout = signal<Block[]>([]);
  importWorkout = signal<Block[]>([]);

  onWorkoutSelected(workout: Block[]): void {
    this.importWorkout.set(workout);
    this._snackBar.open('Workout loaded');
  }

  onExerciseSelected(exercise: Exercise): void {
    this.selectedExercise.set(exercise);
    this._snackBar.open('Added to workout: ' + exercise.Name);
  }
}
