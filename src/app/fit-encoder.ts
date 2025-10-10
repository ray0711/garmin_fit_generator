// Import the SDK
import {Encoder, Profile} from "@garmin/fitsdk";
import * as fs from "fs";

export class FitEncoder {

  public encode() {
// Create an Encoder
    const encoder = new Encoder();

//
// Write messages to the output-stream
//
// The message data should match the format returned by
// the Decoder. Field names should be camelCase. The fields
// definitions can be found in the Profile.
//

// Pass the MesgNum and message data as separate parameters to the onMesg() method
    encoder.onMesg(Profile.MesgNum.FILE_ID, {
      manufacturer: "development",
      product: 1,
      timeCreated: new Date(),
      type: "activity",
    });

// The writeMesg() method expects the mesgNum to be included in the message data
// Internally, writeMesg() calls onMesg()
    encoder.writeMesg({
      mesgNum: Profile.MesgNum.FILE_ID,
      manufacturer: "development",
      product: 1,
      timeCreated: new Date(),
      type: "activity",
    });

// Unknown values in the message will be ignored by the Encoder
    encoder.onMesg(Profile.MesgNum.FILE_ID, {
      manufacturer: "development",
      product: 1,
      timeCreated: new Date(),
      type: "activity",
      customField: 12345, // This value will be ignored by the Encoder
    });

// Subfield values in the message will be ignored by the Encoder
    encoder.onMesg(Profile.MesgNum.FILE_ID, {
      manufacturer: "development",
      product: 4440, // This is the main product field, which is a uint16
      garminProduct: "edge1050", // This value will be ignored by the Encoder, use the main field value instead
      timeCreated: new Date(),
      type: "activity",
    });

// Closing the encoder returns the file as an UInt8 Array
    const uint8Array = encoder.close();

// Write the file to disk,

    fs.writeFileSync("example.fit", uint8Array);
  }

}
