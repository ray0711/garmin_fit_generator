import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FitControl} from './fit-control/fit-control';
import {ExerciseSelectorComponent} from './exercise-selector/exercise-selector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FitControl, ExerciseSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('garmin_workout_generator');
}
