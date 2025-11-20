import Decoder from '../types_generated/decoder.js';
import Stream from '../types_generated/stream.js';
import { Message_EXERCISE_TITLE, Message_WORKOUT_STEP } from '../types_auto/MessageTypes';
import {
  ExerciseCategory,
  WktStepDuration,
  WktStepTarget,
  intensity,
} from '../types_auto/fitsdk_enums';
import {
  Block,
  RepeatBlock,
  WorkoutBlock,
  Target,
  TargetTime,
  TargetReps,
  TargetLapButton,
  TargetCalories,
  HeartRateTarget,
} from './workout-builder/block';
import { Profile } from '../types_generated';

function camelToScreamingSnake(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toUpperCase();
}

function resolveExerciseName(categoryKey: string, exerciseNumber: number | undefined): string {
  if (exerciseNumber == null) return '';
  const mapKey = `${categoryKey}ExerciseName`;
  const exerciseMap = (Profile.types as Record<string, Record<number, string> | undefined>)[mapKey];
  if (!exerciseMap) return '';
  return exerciseMap[exerciseNumber] ?? '';
}

export class FitDecoder {
  public static decode(data: Uint8Array | number[]): Block[] {
    const byteArr: number[] = Array.isArray(data)
      ? (data as number[])
      : Array.from(data as Uint8Array);
    const stream = Stream.fromByteArray(byteArr);
    const decoder = new Decoder(stream);
    const { messages } = decoder.read({ convertTypesToStrings: false });

    const stepMessages: Message_WORKOUT_STEP[] = (messages['workoutStepMesgs'] ??
      messages['workout_step'] ??
      []) as Message_WORKOUT_STEP[];
    const titleMessages: Message_EXERCISE_TITLE[] = (messages['exerciseTitleMesgs'] ??
      messages['exercise_title'] ??
      []) as Message_EXERCISE_TITLE[];

    // Some decoders return camelCase arrays, some snake_case; normalize above.
    const titlesQueue = [...titleMessages];

    const stack: Block[] = [];

    for (const step of stepMessages) {
      // Identify repeat markers
      if (step.durationType === WktStepDuration.repeatUntilStepsCmplt) {
        const count = Math.max(0, step.durationValue ?? 0);
        const sets = Math.max(1, step.targetValue ?? 1);
        const children = stack.splice(stack.length - count, count);
        const repeat = new RepeatBlock();
        repeat.sets = sets;

        // Heuristic: Check if children follow [Step, Rest, Step, Rest...] pattern
        // 1. Must have even number of children (pairs of Step+Rest)
        // 2. Must have at least 2 children
        if (children.length > 0 && children.length % 2 === 0) {
          const firstRest = children[1];
          // Check if the potential rest block is actually a rest
          if (firstRest instanceof WorkoutBlock && firstRest.intensity === intensity.rest) {
            // Verify all even indices (0, 2, 4...) are steps and odd indices (1, 3, 5...) are identical rests
            const isAutoRestPattern = children.every((child, index) => {
              if (index % 2 === 1) {
                // Odd index: must match the first rest block
                return child.equals(firstRest);
              }
              return true; // Even index: can be any step
            });

            if (isAutoRestPattern) {
              repeat.autoRest = firstRest;
              // Filter out the rest blocks, keeping only the steps
              repeat.children = children.filter((_, index) => index % 2 === 0);
            } else {
              repeat.children = children;
            }
          } else {
            repeat.children = children;
          }
        } else {
          repeat.children = children;
        }

        stack.push(repeat);
        continue;
      }

      // Normal workout step
      const categoryField = step.exerciseCategory as unknown as
        | ExerciseCategory
        | string
        | undefined;
      let categoryKey = '';
      if (typeof categoryField === 'string') {
        categoryKey = categoryField; // already like 'benchPress'
      } else if (typeof categoryField === 'number') {
        // map enum number to key name
        categoryKey = ExerciseCategory[categoryField] as unknown as string;
      }

      const resolved = resolveExerciseName(categoryKey, step.exerciseName);
      const nameGarmin = resolved ? camelToScreamingSnake(resolved) : '';
      const categoryGarmin = camelToScreamingSnake(categoryKey || 'unknown');

      const name = (step.wktStepName ?? nameGarmin) || 'Step';
      const wb = new WorkoutBlock(name, false, false, categoryGarmin, nameGarmin);
      wb.notes = step.notes;

      // target reconstruction
      const durationType = step.durationType;
      const targetType = step.targetType;
      let target: Target;
      if (durationType === WktStepDuration.time) {
        const duration = step.durationValue ?? 0;
        target = new TargetTime(Math.max(0, duration / 1000));
      } else if (durationType === WktStepDuration.reps) {
        target = new TargetReps(Math.max(0, step.durationValue ?? 0), step.exerciseWeight ?? 0);
      } else if (durationType === WktStepDuration.calories) {
        target = new TargetCalories(Math.max(0, step.durationValue ?? 0));
      } else if (targetType === WktStepTarget.heartRate) {
        // HR target encoded as open duration with heart rate bounds
        const low = step.customTargetValueLow;
        const high = step.customTargetValueHigh;
        if (low != null) {
          target = new HeartRateTarget(low, 'above');
        } else if (high != null) {
          target = new HeartRateTarget(high, 'below');
        } else {
          target = new TargetLapButton();
        }
      } else {
        // open/manual
        target = new TargetLapButton();
      }
      wb.target = target;

      // Consume next exercise title for nameOverride if available
      const nextTitle = titlesQueue[0];
      if (nextTitle) {
        // We wrote titles only for non-repeat steps in the same order
        titlesQueue.shift();
        if (nextTitle.wktStepName) {
          wb.nameOverride = nextTitle.wktStepName;
        }
      }

      stack.push(wb);
    }

    return stack;
  }
}

export default FitDecoder;
