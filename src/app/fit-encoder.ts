// Import the SDK
// import {Encoder, Profile} from "@garmin/fitsdk";
// import * as fs from "fs";
import {Encoder, Profile, WORKOUT_MESG} from '@garmin/fitsdk';
import {Sport, SubSport} from '../types/fitsdk_enums';

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
//         encoder.onMesg(Profile.MesgNum.FILE_ID, {
//             manufacturer: "development",
//             product: 1,
//             timeCreated: new Date(),
//             type: "activity",
//         });

// The writeMesg() method expects the mesgNum to be included in the message data
// Internally, writeMesg() calls onMesg()

        encoder.writeMesg({
            mesgNum: Profile.MesgNum.FILE_ID,
            manufacturer: "development",
            product: 1,
            timeCreated: new Date(),
            type: "activity"
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
            mesgNum: Profile.MesgNum.WORKOUT,
            sport: Sport.training,
            subSport: SubSport.strengthTraining,
            wktName: "FMS-Test",
            numValidSteps: 10,
        } as WORKOUT_MESG)


        // encoder.writeMesg({
        //     mesgNum: Profile.MesgNum.SLAVE_DEVICE,
        //     manufacturer: "development",
        //     product: 1,
        //     timeCreated: new Date(),
        //     type: "activity"
        // });

// // Unknown values in the message will be ignored by the Encoder
//     encoder.onMesg(Profile.MesgNum.FILE_ID, {
//       manufacturer: "development",
//       product: 1,
//       timeCreated: new Date(),
//       type: "activity",
//       customField: 12345, // This value will be ignored by the Encoder
//     });
//
// // Subfield values in the message will be ignored by the Encoder
//     encoder.onMesg(Profile.MesgNum.FILE_ID, {
//       manufacturer: "development",
//       product: 4440, // This is the main product field, which is a uint16
//       garminProduct: "edge1050", // This value will be ignored by the Encoder, use the main field value instead
//       timeCreated: new Date(),
//       type: "activity",
//     });

// Closing the encoder returns the file as an UInt8 Array
        const fitFIle = encoder.close();
        return fitFIle;

// Write the file to disk,

        // fs.writeFileSync("example.fit", uint8Array);
    }

}
