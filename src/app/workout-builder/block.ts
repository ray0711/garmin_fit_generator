import { intensity } from '../../types_auto/fitsdk_enums';

export type Block = RepeatBlock | WorkoutBlock;
export interface BasicBlock {
  name: string;
  selected: boolean;
  clone(): Block;
  flat(level: number): BlockLevel[];
}

export interface BlockLevel {
  block: Block;
  level: number;
}

export class RepeatBlock implements BasicBlock {
  name = 'Repeat';
  sets = 2;
  children: Block[] = [];
  clone(): RepeatBlock {
    const newObject = new RepeatBlock();
    newObject.children = this.children.map((child) => child.clone());
    return newObject;
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
  readonly name: string;
  selected = false;
  nameOverride: string;
  nameGarmin?: string;
  categoryGarmin?: string;
  intensity: intensity = intensity.active;
  target: Target = new TargetTime(60);
  notes?: string;

  constructor(
    name: string,
    selected: boolean,
    categoryGarmin?: string,
    nameGarmin?: string,
    intensity?: intensity,
    target?: Target,
    notes?: string,
  ) {
    this.name = name;
    this.nameOverride = name;
    this.nameGarmin = nameGarmin;
    this.categoryGarmin = categoryGarmin;
    if (intensity) this.intensity = intensity;
    if (target) this.target = target;
    if (notes !== undefined) this.notes = notes;
  }
  clone(): WorkoutBlock {
    const cloned = new WorkoutBlock(
      this.name,
      this.selected,
      this.categoryGarmin,
      this.nameGarmin,
      this.intensity,
      this.target,
      this.notes,
    );
    cloned.nameOverride = this.nameOverride;
    return cloned;
  }
  flat(level: number): BlockLevel[] {
    return [{ block: this, level: level }];
  }
}
