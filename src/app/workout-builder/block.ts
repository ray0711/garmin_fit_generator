import { intensity } from '../../types_auto/fitsdk_enums';
import { v4 as uuidv4 } from 'uuid';

export type Block = RepeatBlock | WorkoutBlock;
export interface BasicBlock {
  uuid: string;
  name: string;
  selected: boolean;
  opened: boolean;
  clone(): Block;
  cloneWithNewUuid(): Block;
  flat(level: number): BlockLevel[];
  equals(other: Block): boolean;
}

export interface BlockLevel {
  block: Block;
  level: number;
}

export class RepeatBlock implements BasicBlock {
  uuid = uuidv4();
  name = 'Repeat';
  sets = 2;
  children: Block[] = [];
  opened = false;
  equals(other: Block): boolean {
    return (
      other instanceof RepeatBlock &&
      other.uuid == this.uuid &&
      other.sets == this.sets &&
      other.children.length == this.children.length &&
      other.children.every((child, index) => child.equals(this.children[index])) &&
      this.opened == other.opened
    );
  }
  constructor(name?: string, sets?: number, children?: Block[], opened?: boolean, uuid?: string) {
    if (name) this.name = name;
    if (sets) this.sets = sets;
    if (children) this.children = children;
    if (opened) this.opened = opened;
    if (uuid) this.uuid = uuid;
  }
  cloneWithNewUuid() {
    const repeatBlock = this.clone();
    repeatBlock.uuid = uuidv4();
    return repeatBlock;
  }
  clone(): RepeatBlock {
    return new RepeatBlock(
      this.name,
      this.sets,
      this.children.map((child) => child.clone()),
      this.opened,
      this.uuid,
    );
  }
  flat(level: number): BlockLevel[] {
    return [
      { block: this, level: level },
      ...this.children.flatMap((child) => child.flat(level + 1)),
    ];
  }

  public set selected(value: boolean) {
    /* empty */
  }
  public get selected(): boolean {
    return false;
  }
}

interface BaseTarget {
  equals(other: Target | undefined): boolean;
}

export class TargetTime implements BaseTarget {
  constructor(public durationSeconds: number) {}
  equals(other: Target | undefined): boolean {
    if (other == undefined) return false;
    if (other instanceof TargetTime) {
      return other.durationSeconds == this.durationSeconds;
    }
    return false;
  }
}

export class TargetReps implements BaseTarget {
  constructor(
    public reps: number,
    public weight: number,
  ) {}
  equals(other: Target | undefined): boolean {
    if (other == undefined) return false;
    if (other instanceof TargetReps) {
      return other.reps == this.reps && other.weight == this.weight;
    }
    return false;
  }
}

export class HeartRateTarget implements BaseTarget {
  constructor(
    public heartRate: number,
    public type: 'above' | 'below',
  ) {}
  equals(other: Target | undefined): boolean {
    if (other == undefined) return false;
    if (other instanceof HeartRateTarget) {
      return other.heartRate == this.heartRate && other.type == this.type;
    }
    return false;
  }
}

export class TargetCalories implements BaseTarget {
  constructor(public calories: number) {}
  equals(other: Target | undefined): boolean {
    if (other == undefined) return false;
    if (other instanceof TargetCalories) {
      return other.calories == this.calories;
    }
    return false;
  }
}

export class TargetLapButton implements BaseTarget {
  equals(other: Target | undefined): boolean {
    return other instanceof TargetLapButton;
  }
}

export type Target = TargetTime | TargetReps | TargetLapButton | TargetCalories | HeartRateTarget;

export class WorkoutBlock implements BasicBlock {
  uuid = uuidv4();
  readonly name: string;
  selected = false;
  opened = false;
  nameOverride: string;
  nameGarmin?: string;
  categoryGarmin?: string;
  intensity: intensity = intensity.active;
  target: Target = new TargetTime(60);
  notes?: string;

  constructor(
    name: string,
    selected: boolean,
    opened: boolean,
    categoryGarmin?: string,
    nameGarmin?: string,
    intensity?: intensity,
    target?: Target,
    notes?: string,
    uuid?: string,
  ) {
    this.name = name;
    this.selected = selected;
    this.opened = opened;
    this.nameOverride = name;
    this.nameGarmin = nameGarmin;
    this.categoryGarmin = categoryGarmin;
    if (intensity) this.intensity = intensity;
    if (target) this.target = target;
    if (notes !== undefined) this.notes = notes;
    if (uuid) this.uuid = uuid;
  }
  equals(other: Block | undefined): boolean {
    if (other == undefined) return false;
    return (
      other instanceof WorkoutBlock &&
      other.uuid == this.uuid &&
      other.name == this.name &&
      other.selected == this.selected &&
      other.opened == this.opened &&
      other.nameOverride == this.nameOverride &&
      other.nameGarmin == this.nameGarmin &&
      other.categoryGarmin == this.categoryGarmin &&
      other.intensity == this.intensity &&
      other.notes == this.notes &&
      other.target.equals(this.target)
    );
  }
  cloneWithNewUuid() {
    const workoutBlock = this.clone();
    workoutBlock.uuid = uuidv4();
    return workoutBlock;
  }
  clone(): WorkoutBlock {
    const cloned = new WorkoutBlock(
      this.name,
      this.selected,
      this.opened,
      this.categoryGarmin,
      this.nameGarmin,
      this.intensity,
      this.target,
      this.notes,
      this.uuid,
    );
    cloned.nameOverride = this.nameOverride;
    return cloned;
  }
  flat(level: number): BlockLevel[] {
    return [{ block: this, level: level }];
  }
}
