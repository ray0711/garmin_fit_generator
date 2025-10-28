import { ChangeDetectionStrategy, Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Block, BlockLevel, RepeatBlock, WorkoutBlock } from './block';
import FitDecoder from '../fit-decoder';
import { Control } from './control/control';
import {
  MatTree,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodePadding,
} from '@angular/material/tree';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Exercise } from '../Exercise';
import { intensity } from '../../types/fitsdk_enums';
import { ExerciseControl } from './exercise/exercise-control.component';

@Component({
  selector: 'app-workout-builder',
  imports: [
    CdkDropList,
    CdkDrag,
    Control,
    MatTree,
    MatTreeNode,
    MatTreeNodeDef,
    CdkDropListGroup,
    MatTreeNodePadding,
    ExerciseControl,
    MatButton,
    MatIcon,
  ],
  templateUrl: './workout-builder.html',
  styleUrl: './workout-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutBuilder {
  selectedExercise = input<Exercise | undefined>();

  // Inline helpers for repeat sets in header
  getRepeatSets(block: Block): number {
    return block instanceof RepeatBlock ? Math.max(1, block.sets) : 1;
  }

  updateRepeatSets(block: Block, value: string | number): void {
    if (!(block instanceof RepeatBlock)) return;
    const num = typeof value === 'number' ? value : Number(value);
    const sets = Number.isFinite(num) ? Math.max(1, Math.floor(num)) : 1;
    block.sets = sets;
    // propagate change to consumers
    const current = this.workout();
    this.workout.set([...current]);
    this.workoutOutput.emit(this.workout());
  }

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
    const tmpWorkout = this.workout();

    if (event.previousContainer === event.container) {

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
      tmpWorkout.splice(event.currentIndex, 0, event.item.data().clone());
    }
    this.workout.set([...tmpWorkout]);
    this.workoutOutput.emit(tmpWorkout);
    this.tree.expandAll();
  }

  findParent(list: BlockLevel[], blockLevel: BlockLevel): RepeatBlock | undefined {
    const parent = list.find(
      (element) =>
        element?.block instanceof RepeatBlock &&
        element?.block.children.includes(blockLevel?.block),
    );
    return parent?.block as RepeatBlock | undefined;
  }

  flatWorkout(workout: Block[]): BlockLevel[] {
    return workout.flatMap((block) => {
      return block.flat(0);
    });
  }

  levelAccessor(block: BlockLevel): number {
    return block.level;
  }

  async onFileSelected(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement | null;
    const file = inputEl?.files && inputEl.files.length > 0 ? inputEl.files[0] : undefined;
    if (!file) return;
    try {
      // Only accept .fit extension
      const name = file.name.toLowerCase();
      if (!name.endsWith('.fit')) {
        console.warn('Unsupported file type:', name);
        return;
      }
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blocks = FitDecoder.decode(bytes);
      this.workout.set(blocks);
      this.workoutOutput.emit(blocks);
      // Give tree time to update before expanding
      queueMicrotask(() => this.tree?.expandAll());
    } catch (e) {
      console.error('Failed to decode FIT file:', e);
    } finally {
      // reset input so same file can be re-selected
      if (inputEl) inputEl.value = '';
    }
  }
}
