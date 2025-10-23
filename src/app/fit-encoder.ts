// import {Encoder, MappingInverter, Message_WORKOUT, Message_WORKOUT_STEP, Profile} from '@garmin/fitsdk';
// import {FileType, MesgNum, Sport, SubSport, WktStepDuration} from '../types/fitsdk_enums';
// import {Profile} from '../types_generated';
import Encoder from '../types/encoder';
import {
  ExerciseCategory,
  Message_EXERCISE_TITLE,
  Message_FILE_CREATOR,
  Message_FILE_ID,
  Message_WORKOUT,
  Message_WORKOUT_STEP,
} from '../types/MessageTypes';
// import Sport = Profile.types.subSport;
// import {Profile} from '../types_generated';
// import {Encoder, Profile} from '../types/generated';
import {FileType, Manufacturer, MesgNum, Sport, SubSport, WktStepDuration, WktStepTarget} from '../types/fitsdk_enums';
import {Block, RepeatBlock} from './workout-builder/block';
import {Profile} from '../types_generated';
// import Encoder from '../types/encoder';
// import {Message_WORKOUT_STEP} from '../types/MessageTypes';
// import {Profile} from '../types_generated';
// import MesgNum = ProfileTypes;
// import '../types/ProfileTypes';
// import MesgNum = Profile.MesgNum;
// import MesgNum = Profile.MesgNum;


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

  getWorkoutStepMessage(block: Block, messageIndex: number): Message_WORKOUT_STEP[] {
    if (block instanceof RepeatBlock) {
      return [
        ...block.children.flatMap((child) => this.getWorkoutStepMessage(child, messageIndex )),
        this.getRepeatMessage(block),
      ];
    } else {
      const exerciseCategory = this.findEnumValue(ExerciseCategory, block.categoryGarmin) as ExerciseCategory;
      return [{
        mesgNum: MesgNum.WORKOUT_STEP,
        messageIndex: messageIndex ,
        exerciseName: this.findExeriseNumber(exerciseCategory, block.nameGarmin),
        exerciseCategory: this.findEnumValue(ExerciseCategory, block.categoryGarmin),
        durationValue: 20,
        durationType: WktStepDuration.time,
        targetType: WktStepTarget.open,
        targetValue: 0,
        secondaryTargetValue: 0,
        notes: 'some notes',
        wktStepName: block.name,

      } as Message_WORKOUT_STEP];
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

  getExerciseTitleMessage(exerciseName: number, exerciseCategory: ExerciseCategory, exerciseTitle: string, messageIndex: number): Message_EXERCISE_TITLE {
    return {
      mesgNum: MesgNum.EXERCISE_TITLE,
      messageIndex: messageIndex,
      exerciseName: exerciseName,
      exerciseCategory: exerciseCategory,
      wktStepName: exerciseTitle,
      exerciseTitle: 'test exercise title',
    } as Message_EXERCISE_TITLE;
  }

  public encode(workout: Block[]): Uint8Array {
    const encoder = new Encoder();
    let workoutMessages: Message_WORKOUT_STEP[] = [];

    encoder.writeMesg(this.getFileMessage());
    encoder.writeMesg(this.getFileCreatorMessage());

    let messageIndex = 0;
    for (const block of workout) {
      workoutMessages = workoutMessages.concat(this.getWorkoutStepMessage(block, messageIndex));
      messageIndex += 1;
    }

    encoder.writeMesg(this.getWorkoutMessage(
      workoutMessages.length,
      Sport.training,
      SubSport.strengthTraining,
      'test workout',
      'test workout description',
    ));

    for (const message of workoutMessages) {
      encoder.writeMesg(message);
    }

    let exerciseTitleMessagesIndex= 0;
    for (const msg of workoutMessages) {
      encoder.writeMesg(this.getExerciseTitleMessage(msg.exerciseName as number, msg.exerciseCategory as ExerciseCategory, msg.notes as string, exerciseTitleMessagesIndex));
      exerciseTitleMessagesIndex += 1;
    }


    return encoder.close();
    //
    // Write messages to the output-stream
    //
    // The message data should match the format returned by
    // the Decoder. Field names should be camelCase. The fields
    // definitions can be found in the Profile.
    //

    // // Pass the MesgNum and message data as separate parameters to the onMesg() method
    //         encoder.onMesg(MesgNum.FILE_ID, {
    //             manufacturer: "development",
    //             product: 1,
    //             timeCreated: new Date(),
    //             type: "activity",
    //         });

    // The writeMesg() method expects the mesgNum to be included in the message data
    // Internally, writeMesg() calls onMesg()


    /*
    *   // 5. Every FIT Workout file MUST contain a Workout message as the second message
var workoutMesg = new WorkoutMesg();
workoutMesg.SetWktName("Bike Workout");
workoutMesg.SetSport(Sport.Cycling);
workoutMesg.SetSubSport(SubSport.Invalid);
workoutMesg.SetNumValidSteps(1);
encoder.Write(workoutMesg);

        * */
    /*    encoder.writeMesg({
          mesgNum: MesgNum.WORKOUT,
          sport: Sport.training,
          subSport: SubSport.strengthTraining,
          wktName: 'FMS-Test',
          numValidSteps: 10,
          wktDescription: 'Test Workout',
        });

        for (let i = 0; i < 10; i++) {
          const step: Message_WORKOUT_STEP = {
            mesgNum: MesgNum.WORKOUT_STEP,
            durationType: WktStepDuration.time,
            durationValue: 10,
            exerciseCategory: 0,
            exerciseName: 0,
            notes: '',
            wktStepName: '',
          };
        }*/
  }
}
