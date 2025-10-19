
// This is a wrapper that provides better types
import EncoderImpl from '../types_generated/encoder.js';
import {FitMessage} from './MessageTypes';
// import EncoderImpl from '@garmin/fitsdk'


export class Encoder extends EncoderImpl {
  override writeMesg(mesg: FitMessage): this {
    return super.writeMesg(mesg);
  }
}

export default Encoder;
