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
  children: Block[] = [new WorkoutBlock("Test")];
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

  constructor(name: string) {
    this.name = name;
  }
  clone(): WorkoutBlock {
    return new WorkoutBlock(this.name);
  }
  flat(level: number): BlockLevel[] {
    return [{block: this, level: level}];
  }
}
