import { Component, input } from '@angular/core';
import { Block } from '../block';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-exercise',
  imports: [CdkDrag, CdkDragHandle],
  templateUrl: './exercise-control.component.html',
  styleUrl: './exercise-control.component.scss',
})
export class ExerciseControl {
  block = input<Block>();
}
