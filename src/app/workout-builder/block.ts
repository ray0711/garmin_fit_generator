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
    return other instanceof RepeatBlock && other.uuid == this.uuid;
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

export class TargetTime {
  constructor(public durationSeconds: number) {}
}

export class TargetReps {
  constructor(
    public reps: number,
    public weight: number,
  ) {}
}

export class HeartRateTarget {
  constructor(
    public heartRate: number,
    public type: 'above' | 'below',
  ) {}
}

export class TargetCalories {
  constructor(public calories: number) {}
}

export class TargetLapButton {}

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
    console.log(
      'comparing ' + this.uuid + ' with ' + other.uuid + ' ' + (other instanceof WorkoutBlock),
    );
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
      other.target == this.target &&
      other.notes == this.notes
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
