import { intensity } from '../../types/fitsdk_enums';

export type Block = RepeatBlock | WorkoutBlock;
export interface BasicBlock {
  name: string;
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
}

export type Target = TargetTime | TargetReps | TargetLapButton | TargetCalories | HeartRateTarget;

export interface TargetTime {
  durationSeconds: number;
}

export interface TargetReps {
  reps: number;
  weight: number;
}

export interface HeartRateTarget {
  heartRate: number;
  type: 'above' | 'below';
}
export interface TargetCalories {
  calories: number;
}

export type TargetLapButton = object;

export class WorkoutBlock implements BasicBlock {
  name: string;
  nameGarmin: string;
  categoryGarmin: string;
  intensity: intensity = intensity.active;
  target: Target = { durationSeconds: 60 };

  constructor(
    name: string,
    categoryGarmin: string,
    nameGarmin: string,
    intensity?: intensity,
    target?: Target,
  ) {
    this.name = name;
    this.nameGarmin = nameGarmin;
    this.categoryGarmin = categoryGarmin;
    if (intensity) this.intensity = intensity;
    if (target) this.target = target;
  }
  clone(): WorkoutBlock {
    return new WorkoutBlock(this.name, this.categoryGarmin, this.nameGarmin);
  }
  flat(level: number): BlockLevel[] {
    return [{ block: this, level: level }];
  }
}
