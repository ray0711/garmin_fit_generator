import { Component, input } from '@angular/core';
import { Block } from '../block';

@Component({
  selector: 'app-exercise',
  imports: [],
  templateUrl: './exercise-control.component.html',
  styleUrl: './exercise-control.component.scss',
})
export class ExerciseControl {
  block = input<Block>();
}
