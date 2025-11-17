import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Block } from '../block';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';

@Component({
  selector: 'app-exercise',
  imports: [
    CdkDrag,
    CdkDragHandle,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  templateUrl: './exercise-control.component.html',
  styleUrl: './exercise-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseControl {
  block = input<Block>();
  add = output<Block>();

  addExercise($event: MouseEvent) {
    const block = this.block();
    if (block != undefined) {
      this.add.emit(block);
    }
    $event.stopPropagation();
  }

  clickExercise($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
