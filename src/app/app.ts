import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FitControl} from './fit-control/fit-control';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FitControl],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('garmin_workout_generator');
}
