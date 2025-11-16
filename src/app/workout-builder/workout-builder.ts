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
import { Block, BlockLevel, RepeatBlock, WorkoutBlock } from './block';
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
import { MatFabButton } from '@angular/material/button';
import { MatAccordion } from '@angular/material/expansion';
import { map } from 'rxjs';

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
    ExerciseControl,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    StepTarget,
    MatCardActions,
    MatIcon,
    MatFabButton,
  ],
  templateUrl: './workout-builder.html',
  styleUrl: './workout-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutBuilder {
  private _snackBar = inject(MatSnackBar);
  selectedExercise = input<Exercise | undefined>();
  importWorkout = input<Block[] | undefined>();
  templateTarget = model<WorkoutBlock>(new WorkoutBlock('', false, false, ':', '', intensity.rest));

  staticBuildingBlocks: Block[] = [
    new RepeatBlock(),
    new WorkoutBlock('Rest', false, false, undefined, undefined, intensity.rest),
  ];
  dynamicBuildingBlocks: Block[] = [];

  buildingBlocks: Block[] = this.staticBuildingBlocks.concat(this.dynamicBuildingBlocks);

  workout = signal<Block[]>([]);
  workoutOutput = output<Block[]>();
  flatWorkoutOutput = computed(() => this.flatWorkout(this.workout()));

  @ViewChild('workoutTree') tree!: MatTree<BlockLevel>;
  treeTracker = (index: number, node: BlockLevel) => node.block.uuid;

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
        movingParent.children.splice(movingParent.children.indexOf(moving.block), 1);
      } else {
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
          tmpWorkout.splice(tmpWorkout.indexOf(itemBefore.block) + 1, 0, moving.block);
        } else {
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
        element?.block.children.find(value => value.uuid == blockLevel?.block.uuid),
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

  levelStyle(block: BlockLevel): string {
    return 'level-' + block.level;
  }

  protected applyDefaultTarget() {
    this._snackBar.open(
      'Applying default target: ' + JSON.stringify(this.templateTarget().target),
      'Close',
    );
    for (const blockLevel of this.flatWorkoutOutput()) {
      if (blockLevel.block instanceof WorkoutBlock && blockLevel.block.selected) {
        const clone = blockLevel.block.clone();
        clone.target = this.templateTarget().target;
        this.updateBlockInWorkout(clone);
      }
    }
  }

  updateBlockInWorkout(block: Block | undefined) {
    if (block == undefined) return;
    const blockLevel = this.flatWorkoutOutput().find((b) => b.block.uuid == block.uuid);
    if (blockLevel == undefined) return;
    if (blockLevel.level == 0) {
      if (!blockLevel.block.equals(block)) {
        this.workout.update((w) =>
          w.map((value) =>
            value.uuid == block.uuid && !value.equals(block) ? block.clone() : value,
          ),
        );
      }
    } else {
      const parent = this.findParent(this.flatWorkoutOutput(), blockLevel);
      if (parent) {
        const clone = parent.clone();
        clone.children = parent.children.map((value) => (value.uuid == block.uuid ? block : value));
        this.updateBlockInWorkout(clone);
      }
    }
  }

  protected deleteBlock(blockLevel: BlockLevel) {
    if (blockLevel.level === 0) {
      this.workout.update((value) => value.filter((value1) => value1 != blockLevel.block));
    } else {
      const movingParent = this.findParent(this.flatWorkoutOutput(), blockLevel);
      if (movingParent) {
        movingParent.children.splice(movingParent.children.indexOf(blockLevel.block), 1);
        this.workout.set([...this.workout()]);
      }
    }
  }

  protected addBlock(block: RepeatBlock | WorkoutBlock) {
    if (block instanceof WorkoutBlock) {
      block.target = this.templateTarget().target;
    }
    this.workout.set(this.workout().concat(block.cloneWithNewUuid()));
  }
}
