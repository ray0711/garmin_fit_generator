import { Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Block, BlockLevel, RepeatBlock, WorkoutBlock } from './block';
import { Control } from './control/control';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
  MatTreeNodeToggle,
} from '@angular/material/tree';

import { Exercise } from '../Exercise';
import { intensity } from '../../types/fitsdk_enums';

@Component({
  selector: 'app-workout-builder',
  imports: [
    CdkDropList,
    CdkDrag,
    Control,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodeToggle,
    CdkDropListGroup,
    MatTreeNodePadding,
  ],
  templateUrl: './workout-builder.html',
  styleUrl: './workout-builder.scss',
})
export class WorkoutBuilder {
  selectedExercise = input<Exercise | undefined>();

  staticBuildingBlocks: Block[] = [
    new RepeatBlock(),
    new WorkoutBlock('Pause', 'FIXME:', 'FIXME', intensity.rest),
  ];
  dynamicBuildingBlocks: Block[] = [];

  buildingBlocks: Block[] = this.staticBuildingBlocks.concat(this.dynamicBuildingBlocks);

  workout = signal<Block[]>([]);
  flatWorkoutOutput = signal<BlockLevel[]>([]);
  workoutOutput = output<Block[]>();

  @ViewChild('workoutTree') tree!: MatTree<BlockLevel>;

  constructor() {
    effect(() => {
      const newW = this.workout();
      if (newW) {
        this.flatWorkoutOutput.set(this.flatWorkout(newW));
      }
    });
    effect(() => {
      const exercise = this.selectedExercise();
      if (exercise) {
        const newBlock = new WorkoutBlock(
          exercise.Name,
          exercise.CATEGORY_GARMIN,
          exercise.NAME_GARMIN,
        );
        if (!this.buildingBlocks.includes(newBlock)) {
          this.dynamicBuildingBlocks = [...this.dynamicBuildingBlocks, newBlock].sort((a, b) =>
            a.name.localeCompare(b.name),
          );
          this.buildingBlocks = this.staticBuildingBlocks.concat(this.dynamicBuildingBlocks);
        }
      }
    });
  }

  drop(event: CdkDragDrop<Block[]>) {
    let tmpWorkout = this.workout();

    if (event.previousContainer === event.container) {
      // existing item

      const currentIndex = event.currentIndex;
      const previousIndex = event.previousIndex;
      const flatWorkout = this.flatWorkoutOutput();
      const moving = flatWorkout[event.previousIndex];
      const movingParent = this.findParent(flatWorkout, moving);
      const itemBefore = flatWorkout[event.currentIndex - 1];
      const itemBeforeParent = this.findParent(flatWorkout, itemBefore);

      // delete
      if (movingParent) {
        console.log(
          'deleting from parent at index: ' + movingParent.children.indexOf(moving.block),
        );
        movingParent.children.splice(movingParent.children.indexOf(moving.block), 1);
      } else {
        console.log('deleting from root');
        tmpWorkout.splice(tmpWorkout.indexOf(moving.block), 1);
      }

      // insert
      if (itemBefore?.block instanceof RepeatBlock && !(moving.block instanceof RepeatBlock)) {
        itemBefore.block.children.splice(0, 0, moving.block);
      } else if (itemBeforeParent && !(moving.block instanceof RepeatBlock)) {
        console.log(
          'inserting into parent at index: ' +
            itemBeforeParent.children.indexOf(itemBefore.block) +
            1,
        );
        itemBeforeParent.children.splice(
          itemBeforeParent.children.indexOf(itemBefore.block) + 1,
          0,
          moving.block,
        );
      } else {
        if (itemBefore) {
          console.log('inserting into root at pos ' + tmpWorkout.indexOf(itemBefore?.block) + 1);
          tmpWorkout.splice(tmpWorkout.indexOf(itemBefore.block) + 1, 0, moving.block);
        } else {
          console.log('inserting into root at pos 0');
          tmpWorkout.splice(0, 0, moving.block);
        }
      }
    } else {
      // new item
      tmpWorkout.splice(event.currentIndex, 0, event.item.data.clone());
    }
    this.workout.set([...tmpWorkout]);
    this.workoutOutput.emit(tmpWorkout);
    this.tree.expandAll();
  }

  findParent(list: BlockLevel[], blockLevel: BlockLevel): RepeatBlock | undefined {
    const parent = list.find(
      (element, index: number) =>
        element?.block instanceof RepeatBlock &&
        element?.block.children.includes(blockLevel?.block),
    );
    return parent?.block as RepeatBlock | undefined;
  }

  isRepeat(index: number, block: Block): boolean {
    return block instanceof RepeatBlock;
  }

  flatWorkout(workout: Block[]): BlockLevel[] {
    return workout.flatMap((block) => {
      return block.flat(0);
    });
  }

  levelAccessor(block: BlockLevel): number {
    return block.level;
  }
}
