import Encoder from '../types/encoder';
import {
  ExerciseCategory,
  Message_EXERCISE_TITLE,
  Message_FILE_CREATOR,
  Message_FILE_ID,
  Message_WORKOUT,
  Message_WORKOUT_STEP,
} from '../types/MessageTypes';
import {FileType, Manufacturer, MesgNum, Sport, SubSport, WktStepDuration, WktStepTarget} from '../types/fitsdk_enums';
import {Block, RepeatBlock} from './workout-builder/block';
import {Profile} from '../types_generated';

interface WORKOUT_STEP_AND_TITLE {
  workoutStep: Message_WORKOUT_STEP,
  exerciseTitle: Message_EXERCISE_TITLE | undefined,
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


  findExeriseNumber(exerciseCategory: ExerciseCategory, exerciseName: string): number {
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

  findEnumValue<T>(enumObj: Record<string, T>, searchString: string): T {
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

  getWorkoutStepMessage(block: Block, messageIndex: number): WORKOUT_STEP_AND_TITLE[] {
    if (block instanceof RepeatBlock) {
      return [
        ...block.children.flatMap((child) => this.getWorkoutStepMessage(child, messageIndex)),
        {workoutStep: this.getRepeatMessage(block), exerciseTitle: undefined}
      ];
    } else {
      const exerciseCategory = this.findEnumValue(ExerciseCategory, block.categoryGarmin) as ExerciseCategory;
      const exerciseName = this.findExeriseNumber(exerciseCategory, block.nameGarmin)
      const workoutStepMessage: Message_WORKOUT_STEP = {
        mesgNum: MesgNum.WORKOUT_STEP,
        messageIndex: messageIndex,
        exerciseName: exerciseName,
        exerciseCategory: exerciseCategory,
        durationValue: 60000,
        durationType: WktStepDuration.time,
        targetType: WktStepTarget.open,
        targetValue: 0,
        secondaryTargetValue: 0,
        notes: 'some notes',
        wktStepName: block.name,
      };
      const exerciseTitleMessage: Message_EXERCISE_TITLE = this.getExerciseTitleMessage(
        exerciseName,
        exerciseCategory,
        block.name,
      );
      return [{workoutStep: workoutStepMessage, exerciseTitle: exerciseTitleMessage}];
    }
  }


  getRepeatMessage(block: RepeatBlock): Message_WORKOUT_STEP {
    return {
      mesgNum: MesgNum.WORKOUT_STEP,
      durationType: WktStepDuration.repeatUntilStepsCmplt,
      durationValue: block.children.length,
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
      capabilities: 32
    } as Message_WORKOUT;
  }

  getFileCreatorMessage(): Message_FILE_CREATOR {
    return {
      mesgNum: MesgNum.FILE_CREATOR,
      softwareVersion: 0,
      hardwareVersion: 0,
    } as Message_FILE_CREATOR;
  }

  getExerciseTitleMessage(exerciseName: number, exerciseCategory: ExerciseCategory, exerciseTitle: string): Message_EXERCISE_TITLE {
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

    let messageIndex = 0;
    for (const block of workout) {
      workoutstepandtitles = workoutstepandtitles.concat(this.getWorkoutStepMessage(block, messageIndex));
      messageIndex += 1;
    }

    encoder.writeMesg(this.getWorkoutMessage(
      workoutstepandtitles.length,
      Sport.training,
      SubSport.strengthTraining,
      'test ' + new Date().toISOString(),
      'description: ' + new Date().toISOString(),
    ));

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
