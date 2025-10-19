import {Component, effect, input, ViewChild} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup,} from '@angular/cdk/drag-drop';
import {Block, BlockLevel, RepeatBlock, WorkoutBlock} from './block';
import {Control} from './control/control';
import {MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle} from '@angular/material/tree';
import {MatIconButton} from '@angular/material/button';
import {ArrayDataSource} from '@angular/cdk/collections';
import {Exercise} from '../Exercise';
import {intensity} from '../../types/fitsdk_enums';


@Component({
  selector: 'app-workout-builder',
  imports: [
    CdkDropList,
    CdkDrag,
    Control,
    MatTree,
    MatTreeNode,
    MatIconButton,
    MatTreeNodeDef,
    MatTreeNodeToggle,
    CdkDropListGroup,
    MatTreeNodePadding
  ],
  templateUrl: './workout-builder.html',
  styleUrl: './workout-builder.scss'
})
export class WorkoutBuilder {
  selectedExercise = input<Exercise | undefined>();

  staticBuildingBlocks: Block[] = [new RepeatBlock(), new WorkoutBlock('Pause', 'FIXME:', 'FIXME', intensity.rest)];
  dynamicBuildingBlocks: Block[] = [];

  buildingBlocks: Block[] = this.staticBuildingBlocks.concat(this.dynamicBuildingBlocks);

  workout: Block[] = [];
  datasource: ArrayDataSource<BlockLevel> = new ArrayDataSource(this.flatWorkout());

  @ViewChild('workoutTree') tree!: MatTree<BlockLevel>;


  constructor() {
    effect(() => {
      const exercise = this.selectedExercise();
      if (exercise) {
        let newBlock = new WorkoutBlock(exercise.Name, exercise.CATEGORY_GARMIN, exercise.NAME_GARMIN);
        if(!this.buildingBlocks.includes(newBlock)){
          this.dynamicBuildingBlocks = [...this.dynamicBuildingBlocks, newBlock].sort((a, b) => a.name.localeCompare(b.name))
          this.buildingBlocks = this.staticBuildingBlocks.concat(this.dynamicBuildingBlocks);
        }

      }
    });
  }

  dropPredicate(drag: CdkDrag<any>, drop: CdkDropList<any>): boolean {
     if(drop.data){
       console.log("dropPredicate: " + drop.data);
     }
     return true;
  }

  sortPredicate(index: number, drag: CdkDrag, drop: CdkDropList): boolean {

    return false;
   }


  drop(event
       :
       CdkDragDrop<Block[]>
  ) {
    if (event.previousContainer === event.container) {
      // existing item

      let currentIndex = event.currentIndex;
      let previousIndex = event.previousIndex;
      let flatWorkout = this.flatWorkout();
      let moving = flatWorkout[event.previousIndex];
      let movingParent = this.findParent(flatWorkout, moving);
      let itemBefore = flatWorkout[event.currentIndex - 1];
      let itemBeforeParent = this.findParent(flatWorkout, itemBefore);

      // delete
      if (movingParent) {
        console.log("deleting from parent at index: " + movingParent.children.indexOf(moving.block));
        movingParent.children.splice(movingParent.children.indexOf(moving.block), 1);
      } else {
        console.log("deleting from root");
        this.workout.splice(this.workout.indexOf(moving.block), 1)
      }

      // insert
      if (itemBefore?.block instanceof RepeatBlock && !(moving.block instanceof RepeatBlock)) {
        itemBefore.block.children.splice(0, 0, moving.block);
      } else if (itemBeforeParent && !( moving.block instanceof RepeatBlock)) {
        console.log("inserting into parent at index: " + itemBeforeParent.children.indexOf(itemBefore.block) + 1);
        itemBeforeParent.children.splice(itemBeforeParent.children.indexOf(itemBefore.block) + 1, 0, moving.block);
      } else {
        if (itemBefore) {
          console.log("inserting into root at pos " + this.workout.indexOf(itemBefore?.block) + 1);
          this.workout.splice(this.workout.indexOf(itemBefore.block) + 1, 0, moving.block);
        } else {
          console.log("inserting into root at pos 0");
          this.workout.splice(0, 0, moving.block);
        }
      }

      this.updateWorkout(this.workout);
    } else {
      // new item
      this.updateWorkout(this.workout.toSpliced(event.currentIndex, 0, event.item.data.clone()));
    }
    this.tree.expandAll()
  }

  findParent(list: BlockLevel[], blockLevel: BlockLevel): RepeatBlock | undefined {
    let parent = list.find((element, index: number) => element?.block instanceof RepeatBlock
      && element?.block.children.includes(blockLevel?.block));
    return parent?.block as RepeatBlock | undefined;
  }

  updateWorkout(newWorkout: Block[]) {
    this.workout = newWorkout;
    this.datasource = new ArrayDataSource(this.flatWorkout());
  }

  isRepeat(index: number, block: Block): boolean {
    return block instanceof RepeatBlock;
  }

  flatWorkout(): BlockLevel[] {
    return this.workout.flatMap(block => {
      return block.flat(0);
    });
  }

  levelAccessor(block: BlockLevel): number {
    return block.level;
  }
}
