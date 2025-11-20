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

interface WorkoutNode {
  name: string;
  sets?: number;
  children?: WorkoutNode[];
  selected?: boolean;
  categoryGarmin?: string;
  nameGarmin?: string;
  intensity?: number;
  target?: { durationSeconds?: number; calories?: number };
  nameOverride?: string;
}

function buildBlocksFromJson(json: string): Block[] {
  const data = JSON.parse(json) as unknown[];
  const toBlock = (node: WorkoutNode): Block => {
    if (node.name === 'Repeat') {
      const r = new RepeatBlock();
      r.sets = node.sets ?? 1;
      r.children = (node.children ?? []).map((c: WorkoutNode) => toBlock(c));
      return r;
    }
    const w = new WorkoutBlock(
      node.name,
      Boolean(node.selected),
      false,
      node.categoryGarmin,
      node.nameGarmin,
      node.intensity ?? intensity.active,
    );
    // target
    if (node.target?.durationSeconds != null) {
      // Store as seconds (encoder will convert to ms)
      w.target = new TargetTime(node.target.durationSeconds);
    } else if (node.target?.calories != null) {
      w.target = new TargetCalories(node.target.calories);
    }
    w.nameOverride = node.nameOverride ?? node.name;
    return w;
  };
  return (data as WorkoutNode[]).map(toBlock);
}

function normalize(blocks: Block[]): (
  | { name: 'Repeat'; sets: number; children: unknown }
  | {
      name: 'Workout';
      nameOverride?: string;
      categoryGarmin?: string;
      intensity: number;
      target: { durationSeconds: number } | { calories: number } | 'lap';
    }
)[] {
  return blocks.map((b) => {
    if (b instanceof RepeatBlock) {
      return { name: 'Repeat', sets: b.sets, children: normalize(b.children) };
    }
    const w = b as WorkoutBlock;
    const target: { durationSeconds: number } | { calories: number } | 'lap' =
      w.target instanceof TargetTime
        ? { durationSeconds: w.target.durationSeconds }
        : w.target instanceof TargetCalories
          ? { calories: w.target.calories }
          : 'lap';
    return {
      name: 'Workout',
      nameOverride: w.nameOverride,
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

    const result = FitDecoder.decode(bytes);

    expect(normalize(result.blocks)).toEqual(normalize(original));
  });

  describe('workoutName extraction', () => {
    it('should return object with blocks and workoutName', () => {
      const encoder = new FitEncoder();
      const bytes = encoder.encode([], 'Test Workout');

      const result = FitDecoder.decode(bytes);

      expect(result).toEqual(
        jasmine.objectContaining({
          blocks: jasmine.any(Array),
          workoutName: jasmine.any(String),
        }),
      );
    });

    it('should extract workoutName from encoded FIT file', () => {
      const encoder = new FitEncoder();
      const workoutName = 'My Custom Workout';
      const bytes = encoder.encode([], workoutName);

      const result = FitDecoder.decode(bytes);

      expect(result.workoutName).toBe(workoutName);
    });

    it('should return default name when no workout name provided', () => {
      const encoder = new FitEncoder();
      const bytes = encoder.encode([]);

      const result = FitDecoder.decode(bytes);

      expect(result.workoutName).toBe('Workout');
    });
  });
});
