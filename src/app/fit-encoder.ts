import {
  Message_EXERCISE_TITLE,
  Message_FILE_CREATOR,
  Message_FILE_ID,
  Message_WORKOUT,
  Message_WORKOUT_STEP,
} from '../types_auto/MessageTypes';
import {
  ExerciseCategory,
  FileType,
  Manufacturer,
  MesgNum,
  Sport,
  SubSport,
  WktStepDuration,
  WktStepTarget,
} from '../types_auto/fitsdk_enums';
import {
  Block,
  RepeatBlock,
  WorkoutBlock,
  Target,
  TargetTime,
  TargetReps,
  TargetCalories,
  HeartRateTarget,
} from './workout-builder/block';
import { Encoder, Profile } from '../types_generated';

interface WORKOUT_STEP_AND_TITLE {
  workoutStep: Message_WORKOUT_STEP;
  exerciseTitle: Message_EXERCISE_TITLE | undefined;
}

export class FitEncoder {
  getFileMessage(): Message_FILE_ID {
    return {
      mesgNum: MesgNum.FILE_ID,
      manufacturer: Manufacturer.garmin,
      product: 65534,
      serialNumber: 914919801,
      timeCreated: new Date(),
      type: FileType.workout,
    };
  }

  findExeriseNumber(
    exerciseCategory: ExerciseCategory | undefined,
    exerciseName: string | undefined,
  ): number | undefined {
    if (!exerciseName || !exerciseCategory) {
      return undefined;
    }
    // Convert exerciseCategory enum to its string key (e.g., benchPress, calfRaise, etc.)
    const categoryKey = ExerciseCategory[exerciseCategory];

    // Construct the property name in Profile.types (e.g., benchPressExerciseName)
    const exerciseMapKey = `${categoryKey}ExerciseName`;

    // Access the exercise name map from Profile.types
    const exerciseMap = (Profile.types as any)[exerciseMapKey];

    if (!exerciseMap) {
      throw new Error(`Exercise category map not found for: ${categoryKey}`);
    }

    // Normalize the input exercise name for comparison
    const normalizedInput = exerciseName.toUpperCase().replace(/_/g, '');

    // Find the exercise number by searching through the map
    const entry = Object.entries(exerciseMap).find(([key, value]) => {
      const normalizedKey = (value as string).toUpperCase().replace(/_/g, '');
      return normalizedKey === normalizedInput;
    });

    if (!entry) {
      throw new Error(`Exercise not found for name: ${exerciseName} in category: ${categoryKey}`);
    }

    // Return the value (exercise number)
    return entry[0] as unknown as number;
  }

  findEnumValue<T>(enumObj: Record<string, T>, searchString: string | undefined): T | undefined {
    if (!searchString) {
      return undefined;
    }
    const normalizedInput = searchString.toUpperCase().replace(/_/g, '');

    const entry = Object.entries(enumObj).find(([key, value]) => {
      const normalizedKey = key.toUpperCase().replace(/_/g, '');
      return normalizedKey === normalizedInput;
    });

    if (!entry) {
      throw new Error(`Enum value not found for: ${searchString}`);
    }

    return entry[1] as T;
  }

  // Target types are classes now; we can use instanceof for narrowing.
  private isTargetTime(target: Target): target is TargetTime {
    return target instanceof TargetTime;
  }

  private isTargetReps(target: Target): target is TargetReps {
    return target instanceof TargetReps;
  }

  private isTargetCalories(target: Target): target is TargetCalories {
    return target instanceof TargetCalories;
  }

  private isHeartRateTarget(target: Target): target is HeartRateTarget {
    return target instanceof HeartRateTarget;
  }

  getWorkoutStepMessage(block: Block): WORKOUT_STEP_AND_TITLE[] {
    if (block instanceof RepeatBlock) {
      // Emit children first, then a repeat marker that repeats the previous N steps "sets" times
      const childrenMsgs = block.children.flatMap((child) => this.getWorkoutStepMessage(child));
      return [
        ...childrenMsgs,
        { workoutStep: this.getRepeatMessage(block), exerciseTitle: undefined },
      ];
    } else {
      const w = block as WorkoutBlock;
      const exerciseCategory = this.findEnumValue(ExerciseCategory, w.categoryGarmin) as
        | ExerciseCategory
        | undefined;
      const exerciseName = this.findExeriseNumber(exerciseCategory, w.nameGarmin);

      // Base message with exercise metadata
      const workoutStepMessage: Message_WORKOUT_STEP = {
        mesgNum: MesgNum.WORKOUT_STEP,
        messageIndex: undefined,
        wktStepName: w.name,
        exerciseCategory: exerciseCategory,
        exerciseName: exerciseName,
      };

      // Map target/duration
      const target = w.target as Target;
      if (this.isTargetTime(target)) {
        const t = target;
        workoutStepMessage.durationType = WktStepDuration.time;
        workoutStepMessage.durationValue = Math.max(0, Math.floor(t.durationSeconds * 1000));
        workoutStepMessage.targetType = WktStepTarget.open;
      } else if (this.isTargetReps(target)) {
        const t = target;
        workoutStepMessage.durationType = WktStepDuration.reps;
        workoutStepMessage.durationValue = Math.max(0, Math.floor(t.reps));
        workoutStepMessage.exerciseWeight = t.weight;
        workoutStepMessage.targetType = WktStepTarget.open;
      } else if (this.isTargetCalories(target)) {
        const t = target;
        workoutStepMessage.durationType = WktStepDuration.calories;
        workoutStepMessage.durationValue = Math.max(0, Math.floor(t.calories));
        workoutStepMessage.targetType = WktStepTarget.open;
      } else if (this.isHeartRateTarget(target)) {
        const t = target;
        workoutStepMessage.durationType = WktStepDuration.open;
        workoutStepMessage.targetType = WktStepTarget.heartRate;
        if (t.type === 'above') {
          workoutStepMessage.customTargetValueLow = t.heartRate;
        } else if (t.type === 'below') {
          workoutStepMessage.customTargetValueHigh = t.heartRate;
        }
      } else {
        // Lap button/manual or unspecified → open step
        workoutStepMessage.durationType = WktStepDuration.open;
        workoutStepMessage.targetType = WktStepTarget.open;
      }

      workoutStepMessage.intensity = w.intensity;

      const exerciseTitleMessage: Message_EXERCISE_TITLE = this.getExerciseTitleMessage(
        exerciseName,
        exerciseCategory,
        w.nameOverride,
      );
      return [{ workoutStep: workoutStepMessage, exerciseTitle: exerciseTitleMessage }];
    }
  }

  getRepeatMessage(block: RepeatBlock): Message_WORKOUT_STEP {
    // Repeat the last N steps (children count) for the given number of sets
    return {
      mesgNum: MesgNum.WORKOUT_STEP,
      durationType: WktStepDuration.repeatUntilStepsCmplt,
      durationValue: block.children.length,
      targetType: WktStepTarget.open,
      targetValue: Math.max(1, Math.floor(block.sets)),
    } as Message_WORKOUT_STEP;
  }

  getWorkoutMessage(
    validSteps: number,
    sport: Sport,
    subSport: SubSport,
    wktName: string,
    wktDescription: string,
  ): Message_WORKOUT {
    return {
      mesgNum: MesgNum.WORKOUT,
      messageIndex: 0,
      sport: sport,
      subSport: subSport,
      wktName: wktName,
      numValidSteps: validSteps,
      wktDescription: wktDescription,
      capabilities: 32,
    } as Message_WORKOUT;
  }

  getFileCreatorMessage(): Message_FILE_CREATOR {
    return {
      mesgNum: MesgNum.FILE_CREATOR,
      softwareVersion: 0,
      hardwareVersion: 0,
    } as Message_FILE_CREATOR;
  }

  getExerciseTitleMessage(
    exerciseName: number | undefined,
    exerciseCategory: ExerciseCategory | undefined,
    exerciseTitle: string,
  ): Message_EXERCISE_TITLE {
    return {
      mesgNum: MesgNum.EXERCISE_TITLE,
      exerciseName: exerciseName,
      exerciseCategory: exerciseCategory,
      wktStepName: exerciseTitle,
      exerciseTitle: 'test exercise title',
    } as Message_EXERCISE_TITLE;
  }

  public encode(workout: Block[]): Uint8Array {
    const encoder = new Encoder();
    let workoutstepandtitles: WORKOUT_STEP_AND_TITLE[] = [];

    encoder.writeMesg(this.getFileMessage());
    encoder.writeMesg(this.getFileCreatorMessage());

    for (const block of workout) {
      workoutstepandtitles = workoutstepandtitles.concat(this.getWorkoutStepMessage(block));
    }
    for (let i = 0; i < workoutstepandtitles.length; i++) {
      workoutstepandtitles[i].workoutStep.messageIndex = i;
    }

    encoder.writeMesg(
      this.getWorkoutMessage(
        workoutstepandtitles.length,
        Sport.training,
        SubSport.strengthTraining,
        'test ' + new Date().toISOString(),
        'description: ' + new Date().toISOString(),
      ),
    );

    for (const workoutstepandtitle of workoutstepandtitles) {
      encoder.writeMesg(workoutstepandtitle.workoutStep);
    }

    let exerciseTitleMessagesIndex = 0;
    for (const msg of workoutstepandtitles) {
      if (msg.exerciseTitle) {
        msg.exerciseTitle.messageIndex = exerciseTitleMessagesIndex;
        encoder.writeMesg(msg.exerciseTitle);
        exerciseTitleMessagesIndex += 1;
      }
    }

    return encoder.close();
  }
}
