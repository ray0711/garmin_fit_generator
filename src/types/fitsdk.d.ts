declare module '@garmin/fitsdk' {
    export class Decoder {
        // Add methods you use
        constructor();

        decode(data: ArrayBuffer | Uint8Array): any;
    }

    export class Encoder {
        // Add methods you use
        constructor();


        // onMesg(mesgNum: Profile.MesgNum, mesg: Object);

        writeMesg(mesg: Message_FILE_ID | WORKOUT_MESG);

        close();
    }


    export class Profile {

        static MesgNum: {
            FILE_ID: 0,
            FILE_CREATOR: 49,
            TIMESTAMP_CORRELATION: 162,
            SOFTWARE: 35,
            SLAVE_DEVICE: 106,
            CAPABILITIES: 1,
            FILE_CAPABILITIES: 37,
            MESG_CAPABILITIES: 38,
            FIELD_CAPABILITIES: 39,
            DEVICE_SETTINGS: 2,
            USER_PROFILE: 3,
            HRM_PROFILE: 4,
            SDM_PROFILE: 5,
            BIKE_PROFILE: 6,
            CONNECTIVITY: 127,
            WATCHFACE_SETTINGS: 159,
            OHR_SETTINGS: 188,
            TIME_IN_ZONE: 216,
            ZONES_TARGET: 7,
            SPORT: 12,
            HR_ZONE: 8,
            SPEED_ZONE: 53,
            CADENCE_ZONE: 131,
            POWER_ZONE: 9,
            MET_ZONE: 10,
            TRAINING_SETTINGS: 13,
            DIVE_SETTINGS: 258,
            DIVE_ALARM: 262,
            DIVE_APNEA_ALARM: 393,
            DIVE_GAS: 259,
            GOAL: 15,
            ACTIVITY: 34,
            SESSION: 18,
            LAP: 19,
            LENGTH: 101,
            RECORD: 20,
            EVENT: 21,
            DEVICE_INFO: 23,
            DEVICE_AUX_BATTERY_INFO: 375,
            TRAINING_FILE: 72,
            WEATHER_CONDITIONS: 128,
            WEATHER_ALERT: 129,
            GPS_METADATA: 160,
            CAMERA_EVENT: 161,
            GYROSCOPE_DATA: 164,
            ACCELEROMETER_DATA: 165,
            MAGNETOMETER_DATA: 208,
            BAROMETER_DATA: 209,
            THREE_D_SENSOR_CALIBRATION: 167,
            ONE_D_SENSOR_CALIBRATION: 210,
            VIDEO_FRAME: 169,
            OBDII_DATA: 174,
            NMEA_SENTENCE: 177,
            AVIATION_ATTITUDE: 178,
            VIDEO: 184,
            VIDEO_TITLE: 185,
            VIDEO_DESCRIPTION: 186,
            VIDEO_CLIP: 187,
            SET: 225,
            JUMP: 285,
            SPLIT: 312,
            SPLIT_SUMMARY: 313,
            CLIMB_PRO: 317,
            FIELD_DESCRIPTION: 206,
            DEVELOPER_DATA_ID: 207,
            COURSE: 31,
            COURSE_POINT: 32,
            SEGMENT_ID: 148,
            SEGMENT_LEADERBOARD_ENTRY: 149,
            SEGMENT_POINT: 150,
            SEGMENT_LAP: 142,
            SEGMENT_FILE: 151,
            WORKOUT: 26,
            WORKOUT_SESSION: 158,
            WORKOUT_STEP: 27,
            EXERCISE_TITLE: 264,
            SCHEDULE: 28,
            TOTALS: 33,
            WEIGHT_SCALE: 30,
            BLOOD_PRESSURE: 51,
            MONITORING_INFO: 103,
            MONITORING: 55,
            MONITORING_HR_DATA: 211,
            SPO2_DATA: 269,
            HR: 132,
            STRESS_LEVEL: 227,
            MAX_MET_DATA: 229,
            HSA_BODY_BATTERY_DATA: 314,
            HSA_EVENT: 315,
            HSA_ACCELEROMETER_DATA: 302,
            HSA_GYROSCOPE_DATA: 376,
            HSA_STEP_DATA: 304,
            HSA_SPO2_DATA: 305,
            HSA_STRESS_DATA: 306,
            HSA_RESPIRATION_DATA: 307,
            HSA_HEART_RATE_DATA: 308,
            HSA_CONFIGURATION_DATA: 389,
            HSA_WRIST_TEMPERATURE_DATA: 409,
            MEMO_GLOB: 145,
            SLEEP_LEVEL: 275,
            ANT_CHANNEL_ID: 82,
            ANT_RX: 80,
            ANT_TX: 81,
            EXD_SCREEN_CONFIGURATION: 200,
            EXD_DATA_FIELD_CONFIGURATION: 201,
            EXD_DATA_CONCEPT_CONFIGURATION: 202,
            DIVE_SUMMARY: 268,
            AAD_ACCEL_FEATURES: 289,
            HRV: 78,
            BEAT_INTERVALS: 290,
            HRV_STATUS_SUMMARY: 370,
            HRV_VALUE: 371,
            RAW_BBI: 372,
            RESPIRATION_RATE: 297,
            CHRONO_SHOT_SESSION: 387,
            CHRONO_SHOT_DATA: 388,
            TANK_UPDATE: 319,
            TANK_SUMMARY: 323,
            SLEEP_ASSESSMENT: 346,
            SLEEP_DISRUPTION_SEVERITY_PERIOD: 470,
            SLEEP_DISRUPTION_OVERNIGHT_SEVERITY: 471,
            SKIN_TEMP_OVERNIGHT: 398,
            PAD: 105,
        }
    }



    export type Message_FILE_ID = {
        // mesgNum: 0;
        mesgNum: Profile.MesgNum.FILE_ID;
        manufacturer: string;
        product: number;
        timeCreated: Date;
        type: string;

    }

    export type  WORKOUT_MESG = {
        mesgNum: Profile.MesgNum.WORKOUT;
        sport: Sport;
        subSport: SubSport;
        numValidSteps: Number;
        wktName: String;


    }
    export type Message1 = {
        // mesgNum: 1;
        mesgNum: Profile.MesgNum.CAPABILITIES;
        manufacturer: string;
        product: number;
        // timeCreated: Date;
        // type: string;

    }
    // Add other exports as needed
}