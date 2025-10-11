import {Component} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {Block} from './block';
import {Control} from './control/control';

@Component({
  selector: 'app-workout-builder',
  imports: [
    CdkDropList,
    CdkDrag,
    Control
  ],
  templateUrl: './workout-builder.html',
  styleUrl: './workout-builder.scss'
})
export class WorkoutBuilder {
  staticBuildingBlocks:Block[] = [{name: 'Repeat'}, {name: 'Pause'}];
  dynamicBuildingBlocks: Block[] = [{name: 'Lift'}, {name: 'Push'}, {name: 'Push Ups'}];
  buildingBlocks: Block[] = this.staticBuildingBlocks.concat(this.dynamicBuildingBlocks);

  workout: Block[] = [];

  drop(event: CdkDragDrop<Block[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
