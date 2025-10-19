import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FitControl} from './fit-control/fit-control';
import {ExerciseSelectorComponent} from './exercise-selector/exercise-selector';
import {WorkoutBuilder} from './workout-builder/workout-builder';
import {MatStep, MatStepper} from '@angular/material/stepper';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {Exercise} from './Exercise';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FitControl, ExerciseSelectorComponent, MatStepper, MatStep, WorkoutBuilder],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('garmin_workout_generator');
  private _snackBar = inject(MatSnackBar);
  selectedExercise = signal<Exercise|undefined>(undefined);

  onExerciseSelected(exercise: any): void {
    this.selectedExercise.set( exercise);
    this._snackBar.open("Added to workout: " + exercise.Name);
  }
}
