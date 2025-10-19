// import {Encoder, MappingInverter, Message_WORKOUT, Message_WORKOUT_STEP, Profile} from '@garmin/fitsdk';
// import {FileType, MesgNum, Sport, SubSport, WktStepDuration} from '../types/fitsdk_enums';
// import {Profile} from '../types_generated';
import Encoder from '../types/encoder';
import {Message_WORKOUT_STEP} from '../types/MessageTypes';
// import Sport = Profile.types.subSport;
// import {Profile} from '../types_generated';
// import {Encoder, Profile} from '../types/generated';
import {FileType, MesgNum, Sport, SubSport, WktStepDuration} from '../types/fitsdk_enums';
// import Encoder from '../types/encoder';
// import {Message_WORKOUT_STEP} from '../types/MessageTypes';
// import {Profile} from '../types_generated';
// import MesgNum = ProfileTypes;
// import '../types/ProfileTypes';
// import MesgNum = Profile.MesgNum;
// import MesgNum = Profile.MesgNum;

export class FitEncoder {

  public encode(): Uint8Array {
// Create an Encoder
    const encoder = new Encoder();
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

    console.log(MesgNum.FILE_ID);
    encoder.writeMesg({
      mesgNum: MesgNum.FILE_ID,
      // manufacturer: 0,
      product: 1,
      timeCreated: new Date(),
      type: FileType.activity
    });


    /*
    *   // 5. Every FIT Workout file MUST contain a Workout message as the second message
var workoutMesg = new WorkoutMesg();
workoutMesg.SetWktName("Bike Workout");
workoutMesg.SetSport(Sport.Cycling);
workoutMesg.SetSubSport(SubSport.Invalid);
workoutMesg.SetNumValidSteps(1);
encoder.Write(workoutMesg);

        * */
    encoder.writeMesg({
      mesgNum: MesgNum.WORKOUT,
      sport: Sport.training,
      subSport: SubSport.strengthTraining,
      wktName: "FMS-Test",
      numValidSteps: 10,
      wktDescription: "Test Workout",
    })

    for (let i = 0; i < 10; i++) {
      let step: Message_WORKOUT_STEP = {
        mesgNum: MesgNum.WORKOUT_STEP,
        durationType: WktStepDuration.time,
        durationValue: 10,
        exerciseCategory: 0,
        exerciseName: 0,
        notes: '',
        wktStepName: ''

      }
    }
    return encoder.close();

  }

}
