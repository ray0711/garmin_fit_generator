import {intensity} from '../../types/fitsdk_enums';

export type Block = RepeatBlock | WorkoutBlock;
export type BasicBlock = {
  name: string;
  clone(): Block;
  flat(level: number): BlockLevel[];
}

export type BlockLevel  = {
  block: Block;
  level: number;
}

export class RepeatBlock implements BasicBlock {
  name: string =  "Repeat";
  children: Block[] = [];
  clone(): RepeatBlock {
    let newObject = new RepeatBlock();
    newObject.children = this.children.map(child => child.clone());
    return newObject;
  }
  flat(level: number): BlockLevel[] {
    return [{block: this, level: level}, ...this.children.flatMap(child => child.flat(level + 1))];
  }
}

export class WorkoutBlock implements BasicBlock {
  name: string;
  nameGarmin: string;
  categoryGarmin: string;
  intensity: intensity = intensity.active;


  constructor(name: string, categoryGarmin: string, nameGarmin: string, intensity? : intensity) {
    this.name = name;
    this.nameGarmin = nameGarmin;
    this.categoryGarmin = categoryGarmin;
    if(intensity) this.intensity = intensity;
  }
  clone(): WorkoutBlock {
    return new WorkoutBlock(this.name, this.categoryGarmin, this.nameGarmin);
  }
  flat(level: number): BlockLevel[] {
    return [{block: this, level: level}];
  }
}
