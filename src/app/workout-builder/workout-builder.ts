import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Block, BlockLevel, RepeatBlock, TargetTime, WorkoutBlock } from './block';
import { Control } from './control/control';
import { MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding } from '@angular/material/tree';

import { Exercise } from '../Exercise';
import { intensity } from '../../types_auto/fitsdk_enums';
import { ExerciseControl } from './exercise/exercise-control.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { StepTarget } from './step-target/step-target';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    StepTarget,
    MatCardActions,
    MatIcon,
  ],
  templateUrl: './workout-builder.html',
  styleUrl: './workout-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutBuilder {
  private _snackBar = inject(MatSnackBar);
  selectedExercise = input<Exercise | undefined>();
  importWorkout = input<Block[] | undefined>();
  templateTarget = model<WorkoutBlock>(
    new WorkoutBlock('', false, ':', '', intensity.rest, new TargetTime(60)),
  );

  staticBuildingBlocks: Block[] = [
    new RepeatBlock(),
    new WorkoutBlock('Pause', false, 'FIXME:', 'FIXME', intensity.rest),
  ];
  dynamicBuildingBlocks: Block[] = [];

  buildingBlocks: Block[] = this.staticBuildingBlocks.concat(this.dynamicBuildingBlocks);

  workout = signal<Block[]>([]);
  workoutOutput = output<Block[]>();
  flatWorkoutOutput = computed(() => this.flatWorkout(this.workout()));

  @ViewChild('workoutTree') tree!: MatTree<BlockLevel>;

  constructor() {
    effect(() => {
      const newW = this.importWorkout();
      if (newW) {
        this.workout.set([...newW]);
      }
    });
    effect(() => {
      const b = this.workout();
      this.workoutOutput.emit(b);
    });
    effect(() => {
      const exercise = this.selectedExercise();
      if (exercise) {
        const newBlock = new WorkoutBlock(
          exercise.Name,
          false,
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
      const newBlock = event.item.data().clone();
      newBlock.target = this.templateTarget().target;
      tmpWorkout.splice(event.currentIndex, 0, newBlock);
    }
    this.workout.set([...tmpWorkout]);
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

  protected applyDefaultTarget() {
    this._snackBar.open(
      'Applying default target: ' + JSON.stringify(this.templateTarget().target),
      'Close',
    );
    for (const blockLevel of this.flatWorkoutOutput()) {
      if (blockLevel.block instanceof WorkoutBlock && blockLevel.block.selected) {
        blockLevel.block.target = this.templateTarget().target;
      }
    }
    this.workout.set([...this.workout()]);
  }
}
