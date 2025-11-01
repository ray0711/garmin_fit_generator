import { FitEncoder } from './fit-encoder';
import FitDecoder from './fit-decoder';
import {
  Block,
  RepeatBlock,
  WorkoutBlock,
  TargetTime,
  TargetCalories,
} from './workout-builder/block';
import { intensity } from '../types_auto/fitsdk_enums';

function buildBlocksFromJson(json: string): Block[] {
  const data = JSON.parse(json) as any[];
  const toBlock = (node: any): Block => {
    if (node.name === 'Repeat') {
      const r = new RepeatBlock();
      r.sets = node.sets ?? 1;
      r.children = (node.children ?? []).map((c: any) => toBlock(c));
      return r;
    }
    const w = new WorkoutBlock(
      node.name,
      node.categoryGarmin,
      node.nameGarmin,
      node.intensity ?? intensity.active,
    );
    // target
    if (node.target?.durationSeconds != null) {
      w.target = new TargetTime(node.target.durationSeconds);
    } else if (node.target?.calories != null) {
      w.target = new TargetCalories(node.target.calories);
    }
    w.nameOverride = node.nameOverride ?? node.name;
    return w;
  };
  return data.map(toBlock);
}

function normalize(blocks: Block[]): any {
  return blocks.map((b) => {
    if (b instanceof RepeatBlock) {
      return { name: 'Repeat', sets: b.sets, children: normalize(b.children) };
    }
    const w = b as WorkoutBlock;
    const target: any =
      w.target instanceof TargetTime
        ? { durationSeconds: w.target.durationSeconds }
        : w.target instanceof TargetCalories
          ? { calories: w.target.calories }
          : 'lap';
    return {
      name: 'Workout',
      nameOverride: w.nameOverride,
      nameGarmin: w.nameGarmin,
      categoryGarmin: w.categoryGarmin,
      intensity: w.intensity,
      target,
    };
  });
}

describe('FitDecoder', () => {
  it('encodes then decodes the provided workout JSON and matches', () => {
    const json =
      '[{"name":"Repeat","sets":4,"children":[{"name":"Alternating Dumbbell Chest Press on Swiss Ball","nameOverride":"Alternating Dumbbell Chest Press on Swiss Ball","nameGarmin":"ALTERNATING_DUMBBELL_CHEST_PRESS_ON_SWISS_BALL","categoryGarmin":"BENCH_PRESS","intensity":0,"target":{"durationSeconds":60}}]},{"name":"Repeat","sets":2,"children":[{"name":"Alternating Dumbbell Chest Press on Swiss Ball","nameOverride":"Alternating Dumbbell Chest Press on Swiss Ball","nameGarmin":"ALTERNATING_DUMBBELL_CHEST_PRESS_ON_SWISS_BALL","categoryGarmin":"BENCH_PRESS","intensity":0,"target":{"durationSeconds":60}},{"name":"Banded Ab Twist","nameOverride":"Banded Ab Twist","nameGarmin":"AB_TWIST","categoryGarmin":"BANDED_EXERCISES","intensity":0,"target":{"durationSeconds":80}}]}]';

    const original = buildBlocksFromJson(json);

    const encoder = new FitEncoder();
    const bytes = encoder.encode(original);

    const decoded = FitDecoder.decode(bytes);

    expect(normalize(decoded)).toEqual(normalize(original));
  });
});
