 import {FileType, Manufacturer, MesgNum, Sport, SubSport, WktStepDuration, WktStepTarget} from './fitsdk_enums';

export type FitMessage =
  | Message_FILE_ID
  | Message_CAPABILITIES
  | Message_DEVICE_SETTINGS
  | Message_USER_PROFILE
  | Message_HRM_PROFILE
  | Message_SDM_PROFILE
  | Message_BIKE_PROFILE
  | Message_ZONES_TARGET
  | Message_HR_ZONE
  | Message_POWER_ZONE
  | Message_MET_ZONE
  | Message_SPORT
  | Message_TRAINING_SETTINGS
  | Message_GOAL
  | Message_SESSION
  | Message_LAP
  | Message_RECORD
  | Message_EVENT
  | Message_DEVICE_INFO
  | Message_WORKOUT
  | Message_WORKOUT_STEP
  | Message_SCHEDULE
  | Message_WEIGHT_SCALE
  | Message_COURSE
  | Message_COURSE_POINT
  | Message_TOTALS
  | Message_ACTIVITY
  | Message_SOFTWARE
  | Message_FILE_CAPABILITIES
  // | Message_MESG_CAPABILITIES
  // | Message_FIELD_CAPABILITIES
  | Message_FILE_CREATOR
  | Message_BLOOD_PRESSURE
  | Message_SPEED_ZONE
  | Message_MONITORING
  | Message_TRAINING_FILE
  | Message_HRV
  | Message_ANT_RX
  | Message_ANT_TX
  | Message_ANT_CHANNEL_ID
  | Message_LENGTH
  | Message_MONITORING_INFO
  | Message_PAD
  | Message_SLAVE_DEVICE
  | Message_CONNECTIVITY
  | Message_WEATHER_CONDITIONS
  | Message_WEATHER_ALERT
  | Message_CADENCE_ZONE
  | Message_HR
  | Message_SEGMENT_LAP
  | Message_MEMO_GLOB
  | Message_SEGMENT_ID
  | Message_SEGMENT_LEADERBOARD_ENTRY
  | Message_SEGMENT_POINT
  | Message_SEGMENT_FILE
  | Message_WORKOUT_SESSION
  | Message_WATCHFACE_SETTINGS
  | Message_GPS_METADATA
  | Message_CAMERA_EVENT
  | Message_TIMESTAMP_CORRELATION
  | Message_GYROSCOPE_DATA
  | Message_ACCELEROMETER_DATA
  | Message_THREE_D_SENSOR_CALIBRATION
  | Message_VIDEO_FRAME
  | Message_OBDII_DATA
  | Message_NMEA_SENTENCE
  | Message_AVIATION_ATTITUDE
  | Message_VIDEO
  | Message_VIDEO_TITLE
  | Message_VIDEO_DESCRIPTION
  | Message_VIDEO_CLIP
  | Message_OHR_SETTINGS
  | Message_EXD_SCREEN_CONFIGURATION
  | Message_EXD_DATA_FIELD_CONFIGURATION
  | Message_EXD_DATA_CONCEPT_CONFIGURATION
  | Message_FIELD_DESCRIPTION
  | Message_DEVELOPER_DATA_ID
  | Message_MAGNETOMETER_DATA
  | Message_BAROMETER_DATA
  | Message_ONE_D_SENSOR_CALIBRATION
  | Message_MONITORING_HR_DATA
  | Message_TIME_IN_ZONE
  | Message_SET
  | Message_STRESS_LEVEL
  | Message_MAX_MET_DATA
  | Message_DIVE_SETTINGS
  | Message_DIVE_GAS
  | Message_DIVE_ALARM
  | Message_EXERCISE_TITLE
  | Message_DIVE_SUMMARY
  | Message_SPO2_DATA
  | Message_SLEEP_LEVEL
  | Message_JUMP
  | Message_AAD_ACCEL_FEATURES
  | Message_BEAT_INTERVALS
  | Message_RESPIRATION_RATE
  | Message_HSA_ACCELEROMETER_DATA
  | Message_HSA_STEP_DATA
  | Message_HSA_SPO2_DATA
  | Message_HSA_STRESS_DATA
  | Message_HSA_RESPIRATION_DATA
  | Message_HSA_HEART_RATE_DATA
  | Message_SPLIT
  | Message_SPLIT_SUMMARY
  | Message_HSA_BODY_BATTERY_DATA
  | Message_HSA_EVENT
  | Message_CLIMB_PRO
  | Message_TANK_UPDATE
  | Message_TANK_SUMMARY
  | Message_SLEEP_ASSESSMENT
  | Message_HRV_STATUS_SUMMARY
  | Message_HRV_VALUE
  | Message_RAW_BBI
  | Message_DEVICE_AUX_BATTERY_INFO
  | Message_HSA_GYROSCOPE_DATA
  | Message_CHRONO_SHOT_SESSION
  | Message_CHRONO_SHOT_DATA
  | Message_HSA_CONFIGURATION_DATA
  | Message_DIVE_APNEA_ALARM
  | Message_SKIN_TEMP_OVERNIGHT
  | Message_HSA_WRIST_TEMPERATURE_DATA
  | Message_SLEEP_DISRUPTION_SEVERITY_PERIOD
  | Message_SLEEP_DISRUPTION_OVERNIGHT_SEVERITY;

// Message type definitions
export interface Message_FILE_ID {
  mesgNum: MesgNum.FILE_ID;
  type?: FileType;
  manufacturer?: Manufacturer;
  product?: number;
  serialNumber?: number;
  timeCreated?: Date;
  number?: number;
  productName?: string;
}

export interface Message_CAPABILITIES {
  mesgNum: MesgNum.CAPABILITIES;
  languages?: number[];
  sports?: number[];
  workoutsSupported?: number;
  connectivitySupported?: number;
}

export interface Message_DEVICE_SETTINGS {
  mesgNum: MesgNum.DEVICE_SETTINGS;
  activeTimeZone?: number;
  utcOffset?: number;
  timeOffset?: number[];
  timeMode?: string[];
  timeZoneOffset?: number[];
  backlightMode?: string;
  activityTrackerEnabled?: boolean;
  clockTime?: Date;
  pagesEnabled?: number[];
  moveAlertEnabled?: boolean;
  dateMode?: string;
  displayOrientation?: string;
  mountingSide?: string;
  defaultPage?: number[];
  autosyncMinSteps?: number;
  autosyncMinTime?: number;
  lactateThresholdAutodetectEnabled?: boolean;
  bleAutoUploadEnabled?: boolean;
  autoSyncFrequency?: string;
  autoActivityDetect?: number;
  numberOfScreens?: number;
  smartNotificationDisplayOrientation?: string;
  tapInterface?: string;
  tapSensitivity?: string;
}

export interface Message_USER_PROFILE {
  mesgNum: MesgNum.USER_PROFILE;
  messageIndex?: number;
  friendlyName?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  language?: string;
  elevSetting?: string;
  weightSetting?: string;
  restingHeartRate?: number;
  defaultMaxRunningHeartRate?: number;
  defaultMaxBikingHeartRate?: number;
  defaultMaxHeartRate?: number;
  hrSetting?: string;
  speedSetting?: string;
  distSetting?: string;
  powerSetting?: string;
  activityClass?: string;
  positionSetting?: string;
  temperatureSetting?: string;
  localId?: number;
  globalId?: number[];
  wakeTime?: number;
  sleepTime?: number;
  heightSetting?: string;
  userRunningStepLength?: number;
  userWalkingStepLength?: number;
  depthSetting?: string;
  diveCount?: number;
}

export interface Message_HRM_PROFILE {
  mesgNum: MesgNum.HRM_PROFILE;
  messageIndex?: number;
  enabled?: boolean;
  hrmAntId?: number;
  logHrv?: boolean;
  hrmAntIdTransType?: number;
}

export interface Message_SDM_PROFILE {
  mesgNum: MesgNum.SDM_PROFILE;
  messageIndex?: number;
  enabled?: boolean;
  sdmAntId?: number;
  sdmCalFactor?: number;
  odometer?: number;
  speedSource?: boolean;
  sdmAntIdTransType?: number;
  odometerRollover?: number;
}

export interface Message_BIKE_PROFILE {
  mesgNum: MesgNum.BIKE_PROFILE;
  messageIndex?: number;
  name?: string;
  sport?: string;
  subSport?: string;
  odometer?: number;
  bikeSpdAntId?: number;
  bikeCadAntId?: number;
  bikeSpdcadAntId?: number;
  bikePowerAntId?: number;
  customWheelsize?: number;
  autoWheelsize?: number;
  bikeWeight?: number;
  powerCalFactor?: number;
  autoWheelCal?: boolean;
  autoPowerZero?: boolean;
  id?: number;
  spdEnabled?: boolean;
  cadEnabled?: boolean;
  spdcadEnabled?: boolean;
  powerEnabled?: boolean;
  crankLength?: number;
  enabled?: boolean;
  bikeSpdAntIdTransType?: number;
  bikeCadAntIdTransType?: number;
  bikeSpdcadAntIdTransType?: number;
  bikePowerAntIdTransType?: number;
  odometerRollover?: number;
  frontGearNum?: number;
  frontGear?: number[];
  rearGearNum?: number;
  rearGear?: number[];
  shimanoDi2Enabled?: boolean;
}

export interface Message_ZONES_TARGET {
  mesgNum: MesgNum.ZONES_TARGET;
  maxHeartRate?: number;
  thresholdHeartRate?: number;
  functionalThresholdPower?: number;
  hrCalcType?: string;
  pwrCalcType?: string;
}

export interface Message_HR_ZONE {
  mesgNum: MesgNum.HR_ZONE;
  messageIndex?: number;
  highBpm?: number;
  name?: string;
}

export interface Message_POWER_ZONE {
  mesgNum: MesgNum.POWER_ZONE;
  messageIndex?: number;
  highValue?: number;
  name?: string;
}

export interface Message_MET_ZONE {
  mesgNum: MesgNum.MET_ZONE;
  messageIndex?: number;
  highBpm?: number;
  calories?: number;
  fatCalories?: number;
}

export interface Message_SPORT {
  mesgNum: MesgNum.SPORT;
  sport?: string;
  subSport?: string;
  name?: string;
}

export interface Message_TRAINING_SETTINGS {
  mesgNum: MesgNum.TRAINING_SETTINGS;
  hrCalcType?: string;
  pwrCalcType?: string;
}

export interface Message_GOAL {
  mesgNum: MesgNum.GOAL;
  messageIndex?: number;
  sport?: string;
  subSport?: string;
  startDate?: Date;
  endDate?: Date;
  type?: string;
  value?: number;
  repeat?: boolean;
  targetValue?: number;
  recurrence?: string;
  recurrenceValue?: number;
  enabled?: boolean;
  source?: string;
}

export interface Message_SESSION {
  mesgNum: MesgNum.SESSION;
  messageIndex?: number;
  timestamp?: Date;
  event?: string;
  eventType?: string;
  startTime?: Date;
  startPositionLat?: number;
  startPositionLong?: number;
  sport?: string;
  subSport?: string;
  totalElapsedTime?: number;
  totalTimerTime?: number;
  totalDistance?: number;
  totalCycles?: number;
  totalCalories?: number;
  totalFatCalories?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgCadence?: number;
  maxCadence?: number;
  avgPower?: number;
  maxPower?: number;
  totalAscent?: number;
  totalDescent?: number;
  totalTrainingEffect?: number;
  firstLapIndex?: number;
  numLaps?: number;
  eventGroup?: number;
  trigger?: string;
  necLat?: number;
  necLong?: number;
  swcLat?: number;
  swcLong?: number;
  numLengths?: number;
  normalizedPower?: number;
  trainingStressScore?: number;
  intensityFactor?: number;
  leftRightBalance?: number;
  avgStrokeCount?: number;
  avgStrokeDistance?: number;
  swimStroke?: string;
  poolLength?: number;
  thresholdPower?: number;
  poolLengthUnit?: string;
  numActiveLengths?: number;
  totalWork?: number;
  avgAltitude?: number;
  maxAltitude?: number;
  gpsAccuracy?: number;
  avgGrade?: number;
  avgPosGrade?: number;
  avgNegGrade?: number;
  maxPosGrade?: number;
  maxNegGrade?: number;
  avgTemperature?: number;
  maxTemperature?: number;
  totalMovingTime?: number;
  avgPosVerticalSpeed?: number;
  avgNegVerticalSpeed?: number;
  maxPosVerticalSpeed?: number;
  maxNegVerticalSpeed?: number;
  minHeartRate?: number;
  timeInHrZone?: number[];
  timeInSpeedZone?: number[];
  timeInCadenceZone?: number[];
  timeInPowerZone?: number[];
  avgLapTime?: number;
  bestLapIndex?: number;
  minAltitude?: number;
  playerScore?: number;
  opponentScore?: number;
  opponentName?: string;
  strokeCount?: number[];
  zoneCount?: number[];
  maxBallSpeed?: number;
  avgBallSpeed?: number;
  avgVerticalOscillation?: number;
  avgStanceTimePercent?: number;
  avgStanceTime?: number;
  avgFractionalCadence?: number;
  maxFractionalCadence?: number;
  totalFractionalCycles?: number;
  avgTotalHemoglobinConc?: number[];
  minTotalHemoglobinConc?: number[];
  maxTotalHemoglobinConc?: number[];
  avgSaturatedHemoglobinPercent?: number[];
  minSaturatedHemoglobinPercent?: number[];
  maxSaturatedHemoglobinPercent?: number[];
  avgLeftTorqueEffectiveness?: number;
  avgRightTorqueEffectiveness?: number;
  avgLeftPedalSmoothness?: number;
  avgRightPedalSmoothness?: number;
  avgCombinedPedalSmoothness?: number;
  sportIndex?: number;
  timeStanding?: number;
  standCount?: number;
  avgLeftPco?: number;
  avgRightPco?: number;
  avgLeftPowerPhase?: number[];
  avgLeftPowerPhasePeak?: number[];
  avgRightPowerPhase?: number[];
  avgRightPowerPhasePeak?: number[];
  avgPowerPosition?: number[];
  maxPowerPosition?: number[];
  avgCadencePosition?: number[];
  maxCadencePosition?: number[];
  enhancedAvgSpeed?: number;
  enhancedMaxSpeed?: number;
  enhancedAvgAltitude?: number;
  enhancedMinAltitude?: number;
  enhancedMaxAltitude?: number;
  avgLevMotorPower?: number;
  maxLevMotorPower?: number;
  levBatteryConsumption?: number;
  avgVerticalRatio?: number;
  avgStanceTimeBalance?: number;
  avgStepLength?: number;
  avgVam?: number;
  totalGrit?: number;
  totalFlow?: number;
  jumpCount?: number;
  avgGrit?: number;
  avgFlow?: number;
  totalFractionalAscent?: number;
  totalFractionalDescent?: number;
  avgCoreTemperature?: number;
  minCoreTemperature?: number;
  maxCoreTemperature?: number;
}

export interface Message_LAP {
  mesgNum: MesgNum.LAP;
  messageIndex?: number;
  timestamp?: Date;
  event?: string;
  eventType?: string;
  startTime?: Date;
  startPositionLat?: number;
  startPositionLong?: number;
  endPositionLat?: number;
  endPositionLong?: number;
  totalElapsedTime?: number;
  totalTimerTime?: number;
  totalDistance?: number;
  totalCycles?: number;
  totalCalories?: number;
  totalFatCalories?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgCadence?: number;
  maxCadence?: number;
  avgPower?: number;
  maxPower?: number;
  totalAscent?: number;
  totalDescent?: number;
  intensity?: string;
  lapTrigger?: string;
  sport?: string;
  eventGroup?: number;
  numLengths?: number;
  normalizedPower?: number;
  leftRightBalance?: number;
  firstLengthIndex?: number;
  avgStrokeDistance?: number;
  swimStroke?: string;
  subSport?: string;
  numActiveLengths?: number;
  totalWork?: number;
  avgAltitude?: number;
  maxAltitude?: number;
  gpsAccuracy?: number;
  avgGrade?: number;
  avgPosGrade?: number;
  avgNegGrade?: number;
  maxPosGrade?: number;
  maxNegGrade?: number;
  avgTemperature?: number;
  maxTemperature?: number;
  totalMovingTime?: number;
  avgPosVerticalSpeed?: number;
  avgNegVerticalSpeed?: number;
  maxPosVerticalSpeed?: number;
  maxNegVerticalSpeed?: number;
  timeInHrZone?: number[];
  timeInSpeedZone?: number[];
  timeInCadenceZone?: number[];
  timeInPowerZone?: number[];
  repetitionNum?: number;
  minAltitude?: number;
  minHeartRate?: number;
  wktStepIndex?: number;
  opponentScore?: number;
  strokeCount?: number[];
  zoneCount?: number[];
  avgVerticalOscillation?: number;
  avgStanceTimePercent?: number;
  avgStanceTime?: number;
  avgFractionalCadence?: number;
  maxFractionalCadence?: number;
  totalFractionalCycles?: number;
  playerScore?: number;
  avgTotalHemoglobinConc?: number[];
  minTotalHemoglobinConc?: number[];
  maxTotalHemoglobinConc?: number[];
  avgSaturatedHemoglobinPercent?: number[];
  minSaturatedHemoglobinPercent?: number[];
  maxSaturatedHemoglobinPercent?: number[];
  avgLeftTorqueEffectiveness?: number;
  avgRightTorqueEffectiveness?: number;
  avgLeftPedalSmoothness?: number;
  avgRightPedalSmoothness?: number;
  avgCombinedPedalSmoothness?: number;
  timeStanding?: number;
  standCount?: number;
  avgLeftPco?: number;
  avgRightPco?: number;
  avgLeftPowerPhase?: number[];
  avgLeftPowerPhasePeak?: number[];
  avgRightPowerPhase?: number[];
  avgRightPowerPhasePeak?: number[];
  avgPowerPosition?: number[];
  maxPowerPosition?: number[];
  avgCadencePosition?: number[];
  maxCadencePosition?: number[];
  enhancedAvgSpeed?: number;
  enhancedMaxSpeed?: number;
  enhancedAvgAltitude?: number;
  enhancedMinAltitude?: number;
  enhancedMaxAltitude?: number;
  avgLevMotorPower?: number;
  maxLevMotorPower?: number;
  levBatteryConsumption?: number;
  avgVerticalRatio?: number;
  avgStanceTimeBalance?: number;
  avgStepLength?: number;
  avgVam?: number;
  avgCoreTemperature?: number;
  minCoreTemperature?: number;
  maxCoreTemperature?: number;
}

export interface Message_RECORD {
  mesgNum: MesgNum.RECORD;
  timestamp?: Date;
  positionLat?: number;
  positionLong?: number;
  altitude?: number;
  heartRate?: number;
  cadence?: number;
  distance?: number;
  speed?: number;
  power?: number;
  compressedSpeedDistance?: number[];
  grade?: number;
  resistance?: number;
  timeFromCourse?: number;
  cycleLength?: number;
  temperature?: number;
  speed1s?: number[];
  cycles?: number;
  totalCycles?: number;
  compressedAccumulatedPower?: number;
  accumulatedPower?: number;
  leftRightBalance?: number;
  gpsAccuracy?: number;
  verticalSpeed?: number;
  calories?: number;
  verticalOscillation?: number;
  stanceTimePercent?: number;
  stanceTime?: number;
  activityType?: string;
  leftTorqueEffectiveness?: number;
  rightTorqueEffectiveness?: number;
  leftPedalSmoothness?: number;
  rightPedalSmoothness?: number;
  combinedPedalSmoothness?: number;
  time128?: number;
  strokeType?: string;
  zone?: number;
  ballSpeed?: number;
  cadence256?: number;
  fractionalCadence?: number;
  totalHemoglobinConc?: number;
  totalHemoglobinConcMin?: number;
  totalHemoglobinConcMax?: number;
  saturatedHemoglobinPercent?: number;
  saturatedHemoglobinPercentMin?: number;
  saturatedHemoglobinPercentMax?: number;
  deviceIndex?: number;
  leftPco?: number;
  rightPco?: number;
  leftPowerPhase?: number[];
  leftPowerPhasePeak?: number[];
  rightPowerPhase?: number[];
  rightPowerPhasePeak?: number[];
  enhancedSpeed?: number;
  enhancedAltitude?: number;
  batterySoc?: number;
  motorPower?: number;
  verticalRatio?: number;
  stanceTimeBalance?: number;
  stepLength?: number;
  absolutePressure?: number;
  depth?: number;
  nextStopDepth?: number;
  nextStopTime?: number;
  timeToSurface?: number;
  ndlTime?: number;
  cnsLoad?: number;
  n2Load?: number;
  grit?: number;
  flow?: number;
  currentStress?: number;
  ebikeTravelRange?: number;
  ebikeBatteryLevel?: number;
  ebikeBassistMode?: number;
  ebikeLightMode?: number;
  ebikeLightBatteryLevel?: number;
  coreTemperature?: number;
}

export interface Message_EVENT {
  mesgNum: MesgNum.EVENT;
  timestamp?: Date;
  event?: string;
  eventType?: string;
  data16?: number;
  data?: number;
  eventGroup?: number;
  score?: number;
  opponentScore?: number;
  frontGearNum?: number;
  frontGear?: number;
  rearGearNum?: number;
  rearGear?: number;
  deviceIndex?: number;
  activityType?: string;
  startTimestamp?: Date;
  radarThreatLevelMax?: string;
  radarThreatCount?: number;
  radarThreatAvgApproachSpeed?: number;
  radarThreatMaxApproachSpeed?: number;
}

export interface Message_DEVICE_INFO {
  mesgNum: MesgNum.DEVICE_INFO;
  timestamp?: Date;
  deviceIndex?: number;
  deviceType?: number;
  manufacturer?: Manufacturer;
  serialNumber?: number;
  product?: number;
  softwareVersion?: number;
  hardwareVersion?: number;
  cumOperatingTime?: number;
  batteryVoltage?: number;
  batteryStatus?: string;
  sensorPosition?: string;
  descriptor?: string;
  antTransmissionType?: number;
  antDeviceNumber?: number;
  antNetwork?: string;
  sourceType?: string;
  productName?: string;
  batteryLevel?: number;
}

export interface Message_WORKOUT {
  mesgNum: MesgNum.WORKOUT;
  sport?: Sport;
  subSport?: SubSport;
  capabilities?: number;
  numValidSteps?: number;
  wktName?: string;
  poolLength?: number;
  poolLengthUnit?: string;
  wktDescription?: string;
}

export interface Message_WORKOUT_STEP {
  mesgNum: MesgNum.WORKOUT_STEP;
  messageIndex?: number;
  wktStepName?: string;
  durationType?: WktStepDuration;
  durationValue?: number;
  targetType?: WktStepTarget;
  targetValue?: number;
  customTargetValueLow?: number;
  customTargetValueHigh?: number;
  intensity?: string;
  notes?: string;
  equipment?: string;
  exerciseCategory?: ExerciseCategory;
  exerciseName?: number;
  exerciseWeight?: number;
  weightDisplayUnit?: string;
  secondaryTargetType?: string;
  secondaryTargetValue?: number;
  secondaryCustomTargetValueLow?: number;
  secondaryCustomTargetValueHigh?: number;
}

export interface Message_SCHEDULE {
  mesgNum: MesgNum.SCHEDULE;
  manufacturer?: Manufacturer;
  product?: number;
  serialNumber?: number;
  timeCreated?: Date;
  completed?: boolean;
  type?: string;
  scheduledTime?: Date;
}

export interface Message_WEIGHT_SCALE {
  mesgNum: MesgNum.WEIGHT_SCALE;
  timestamp?: Date;
  weight?: number;
  percentFat?: number;
  percentHydration?: number;
  visceralFatMass?: number;
  boneMass?: number;
  muscleMass?: number;
  basalMet?: number;
  physiqueRating?: number;
  activeMet?: number;
  metabolicAge?: number;
  visceralFatRating?: number;
  userProfileIndex?: number;
  bmi?: number;
}

export interface Message_COURSE {
  mesgNum: MesgNum.COURSE;
  sport?: string;
  name?: string;
  capabilities?: number;
  subSport?: string;
}

export interface Message_COURSE_POINT {
  mesgNum: MesgNum.COURSE_POINT;
  messageIndex?: number;
  timestamp?: Date;
  positionLat?: number;
  positionLong?: number;
  distance?: number;
  type?: string;
  name?: string;
  favorite?: boolean;
}

export interface Message_TOTALS {
  mesgNum: MesgNum.TOTALS;
  messageIndex?: number;
  timestamp?: Date;
  timerTime?: number;
  distance?: number;
  calories?: number;
  sport?: string;
  elapsedTime?: number;
  sessions?: number;
  activeTime?: number;
  sportIndex?: number;
}

export interface Message_ACTIVITY {
  mesgNum: MesgNum.ACTIVITY;
  timestamp?: Date;
  totalTimerTime?: number;
  numSessions?: number;
  type?: string;
  event?: string;
  eventType?: string;
  localTimestamp?: Date;
  eventGroup?: number;
}

export interface Message_SOFTWARE {
  mesgNum: MesgNum.SOFTWARE;
  messageIndex?: number;
  version?: number;
  partNumber?: string;
}

export interface Message_FILE_CAPABILITIES {
  mesgNum: MesgNum.FILE_CAPABILITIES;
  messageIndex?: number;
  type?: string;
  flags?: number;
  directory?: string;
  maxCount?: number;
  maxSize?: number;
}

// export type Message_MESG_CAPABILITIES = {
//   mesgNum: MesgNum.MESG_CAPABILITIES;
//   messageIndex?: number;
//   file?: string;
//   mesgNum?: number;
//   countType?: string;
//   count?: number;
// }

// export type Message_FIELD_CAPABILITIES = {
//   mesgNum: MesgNum.FIELD_CAPABILITIES;
//   messageIndex?: number;
//   file?: string;
//   mesgNum?: number;
//   fieldNum?: number;
//   count?: number;
// }

export interface Message_FILE_CREATOR {
  mesgNum: MesgNum.FILE_CREATOR;
  softwareVersion?: number;
  hardwareVersion?: number;
}

export interface Message_BLOOD_PRESSURE {
  mesgNum: MesgNum.BLOOD_PRESSURE;
  timestamp?: Date;
  systolicPressure?: number;
  diastolicPressure?: number;
  meanArterialPressure?: number;
  map3SampleMean?: number;
  mapMorningValues?: number;
  mapEveningValues?: number;
  heartRate?: number;
  heartRateType?: string;
  status?: string;
  userProfileIndex?: number;
}

export interface Message_SPEED_ZONE {
  mesgNum: MesgNum.SPEED_ZONE;
  messageIndex?: number;
  highValue?: number;
  name?: string;
}

export interface Message_MONITORING {
  mesgNum: MesgNum.MONITORING;
  timestamp?: Date;
  deviceIndex?: number;
  calories?: number;
  distance?: number;
  cycles?: number;
  activeTime?: number;
  activityType?: string;
  activitySubtype?: string;
  activityLevel?: string;
  distance16?: number;
  cycles16?: number;
  activeTime16?: number;
  localTimestamp?: Date;
  temperature?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  activityTime?: number[];
  activeCalories?: number;
  currentActivityTypeIntensity?: number[];
  timestampMin8?: number;
  timestamp16?: number;
  heartRate?: number;
  intensity?: number;
  durationMin?: number;
  duration?: number;
  ascent?: number;
  descent?: number;
  moderateActivityMinutes?: number;
  vigorousActivityMinutes?: number;
}

export interface Message_TRAINING_FILE {
  mesgNum: MesgNum.TRAINING_FILE;
  timestamp?: Date;
  type?: string;
  manufacturer?: Manufacturer;
  product?: number;
  serialNumber?: number;
  timeCreated?: Date;
}

export interface Message_HRV {
  mesgNum: MesgNum.HRV;
  time?: number[];
}

export interface Message_ANT_RX {
  mesgNum: MesgNum.ANT_RX;
  timestamp?: Date;
  fractionalTimestamp?: number;
  mesgId?: number[];
  mesgData?: number[];
  channelNumber?: number;
  data?: number[];
}

export interface Message_ANT_TX {
  mesgNum: MesgNum.ANT_TX;
  timestamp?: Date;
  fractionalTimestamp?: number;
  mesgId?: number[];
  mesgData?: number[];
  channelNumber?: number;
  data?: number[];
}

export interface Message_ANT_CHANNEL_ID {
  mesgNum: MesgNum.ANT_CHANNEL_ID;
  channelNumber?: number;
  deviceType?: number;
  deviceNumber?: number;
  transmissionType?: number;
  deviceIndex?: number;
}

export interface Message_LENGTH {
  mesgNum: MesgNum.LENGTH;
  messageIndex?: number;
  timestamp?: Date;
  event?: string;
  eventType?: string;
  startTime?: Date;
  totalElapsedTime?: number;
  totalTimerTime?: number;
  totalStrokes?: number;
  avgSpeed?: number;
  swimStroke?: string;
  avgSwimmingCadence?: number;
  eventGroup?: number;
  totalCalories?: number;
  lengthType?: string;
  playerScore?: number;
  opponentScore?: number;
  strokeCount?: number[];
  zoneCount?: number[];
  enhancedAvgSpeed?: number;
}

export interface Message_MONITORING_INFO {
  mesgNum: MesgNum.MONITORING_INFO;
  timestamp?: Date;
  localTimestamp?: Date;
  activityType?: string[];
  cyclesToDistance?: number[];
  cyclesToCalories?: number[];
  restingMetabolicRate?: number;
}

export interface Message_PAD {
  mesgNum: MesgNum.PAD;
}

export interface Message_SLAVE_DEVICE {
  mesgNum: MesgNum.SLAVE_DEVICE;
  manufacturer?: Manufacturer;
  product?: number;
}

export interface Message_CONNECTIVITY {
  mesgNum: MesgNum.CONNECTIVITY;
  bluetoothEnabled?: boolean;
  bluetoothLeEnabled?: boolean;
  antEnabled?: boolean;
  name?: string;
  liveTrackingEnabled?: boolean;
  weatherConditionsEnabled?: boolean;
  weatherAlertsEnabled?: boolean;
  autoActivityUploadEnabled?: boolean;
  courseDownloadEnabled?: boolean;
  workoutDownloadEnabled?: boolean;
  gpsEphemerisDownloadEnabled?: boolean;
  incidentDetectionEnabled?: boolean;
  grouptrackEnabled?: boolean;
}

export interface Message_WEATHER_CONDITIONS {
  mesgNum: MesgNum.WEATHER_CONDITIONS;
  timestamp?: Date;
  weatherReport?: string;
  temperature?: number;
  condition?: string;
  windDirection?: number;
  windSpeed?: number;
  precipitationProbability?: number;
  temperatureFeelsLike?: number;
  relativeHumidity?: number;
  location?: string;
  observedAtTime?: Date;
  observedLocationLat?: number;
  observedLocationLong?: number;
  dayOfWeek?: string;
  highTemperature?: number;
  lowTemperature?: number;
}

export interface Message_WEATHER_ALERT {
  mesgNum: MesgNum.WEATHER_ALERT;
  timestamp?: Date;
  reportId?: string;
  issueTime?: Date;
  expireTime?: Date;
  severity?: string;
  type?: string;
}

export interface Message_CADENCE_ZONE {
  mesgNum: MesgNum.CADENCE_ZONE;
  messageIndex?: number;
  highValue?: number;
  name?: string;
}

export interface Message_HR {
  mesgNum: MesgNum.HR;
  timestamp?: Date;
  fractionalTimestamp?: number;
  time256?: number;
  filteredBpm?: number[];
  eventTimestamp?: number[];
  eventTimestamp12?: number[];
}

export interface Message_SEGMENT_LAP {
  mesgNum: MesgNum.SEGMENT_LAP;
  messageIndex?: number;
  timestamp?: Date;
  event?: string;
  eventType?: string;
  startTime?: Date;
  startPositionLat?: number;
  startPositionLong?: number;
  endPositionLat?: number;
  endPositionLong?: number;
  totalElapsedTime?: number;
  totalTimerTime?: number;
  totalDistance?: number;
  totalCycles?: number;
  totalCalories?: number;
  totalFatCalories?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgCadence?: number;
  maxCadence?: number;
  avgPower?: number;
  maxPower?: number;
  totalAscent?: number;
  totalDescent?: number;
  sport?: string;
  eventGroup?: number;
  necLat?: number;
  necLong?: number;
  swcLat?: number;
  swcLong?: number;
  name?: string;
  normalizedPower?: number;
  leftRightBalance?: number;
  subSport?: string;
  totalWork?: number;
  avgAltitude?: number;
  maxAltitude?: number;
  gpsAccuracy?: number;
  avgGrade?: number;
  avgPosGrade?: number;
  avgNegGrade?: number;
  maxPosGrade?: number;
  maxNegGrade?: number;
  avgTemperature?: number;
  maxTemperature?: number;
  totalMovingTime?: number;
  avgPosVerticalSpeed?: number;
  avgNegVerticalSpeed?: number;
  maxPosVerticalSpeed?: number;
  maxNegVerticalSpeed?: number;
  timeInHrZone?: number[];
  timeInSpeedZone?: number[];
  timeInCadenceZone?: number[];
  timeInPowerZone?: number[];
  repetitionNum?: number;
  minAltitude?: number;
  minHeartRate?: number;
  activeTime?: number;
  wktStepIndex?: number;
  sportEvent?: string;
  avgLeftTorqueEffectiveness?: number;
  avgRightTorqueEffectiveness?: number;
  avgLeftPedalSmoothness?: number;
  avgRightPedalSmoothness?: number;
  avgCombinedPedalSmoothness?: number;
  status?: string;
  uuid?: string;
  avgFractionalCadence?: number;
  maxFractionalCadence?: number;
  totalFractionalCycles?: number;
  frontGearShiftCount?: number;
  rearGearShiftCount?: number;
  timeStanding?: number;
  standCount?: number;
  avgLeftPco?: number;
  avgRightPco?: number;
  avgLeftPowerPhase?: number[];
  avgLeftPowerPhasePeak?: number[];
  avgRightPowerPhase?: number[];
  avgRightPowerPhasePeak?: number[];
  avgPowerPosition?: number[];
  maxPowerPosition?: number[];
  avgCadencePosition?: number[];
  maxCadencePosition?: number[];
  manufacturer?: Manufacturer;
  totalGrit?: number;
  totalFlow?: number;
  avgGrit?: number;
  avgFlow?: number;
}

export interface Message_MEMO_GLOB {
  mesgNum: MesgNum.MEMO_GLOB;
  partIndex?: number;
  memo?: number[];
  messageNumber?: number;
  messageIndex?: number;
}

export interface Message_SEGMENT_ID {
  mesgNum: MesgNum.SEGMENT_ID;
  name?: string;
  uuid?: string;
  sport?: string;
  enabled?: boolean;
  userProfilePrimaryKey?: number;
  deviceId?: number;
  defaultRaceLeader?: number;
  deleteStatus?: string;
  selectionType?: string;
}

export interface Message_SEGMENT_LEADERBOARD_ENTRY {
  mesgNum: MesgNum.SEGMENT_LEADERBOARD_ENTRY;
  messageIndex?: number;
  name?: string;
  type?: string;
  groupPrimaryKey?: number;
  activityId?: number;
  segmentTime?: number;
  activityIdString?: string;
}

export interface Message_SEGMENT_POINT {
  mesgNum: MesgNum.SEGMENT_POINT;
  messageIndex?: number;
  positionLat?: number;
  positionLong?: number;
  distance?: number;
  altitude?: number;
  leaderTime?: number[];
}

export interface Message_SEGMENT_FILE {
  mesgNum: MesgNum.SEGMENT_FILE;
  messageIndex?: number;
  fileUuid?: string;
  enabled?: boolean;
  userProfilePrimaryKey?: number;
  leaderType?: string[];
  leaderGroupPrimaryKey?: number[];
  leaderActivityId?: number[];
  leaderActivityIdString?: string[];
  defaultRaceLeader?: number;
}

export interface Message_WORKOUT_SESSION {
  mesgNum: MesgNum.WORKOUT_SESSION;
  messageIndex?: number;
  sport?: string;
  subSport?: string;
  numValidSteps?: number;
  firstStepIndex?: number;
  poolLength?: number;
  poolLengthUnit?: string;
}

export interface Message_WATCHFACE_SETTINGS {
  mesgNum: MesgNum.WATCHFACE_SETTINGS;
  messageIndex?: number;
  mode?: string;
  layout?: number[];
}

export interface Message_GPS_METADATA {
  mesgNum: MesgNum.GPS_METADATA;
  timestamp?: Date;
  timestampMs?: number;
  positionLat?: number;
  positionLong?: number;
  enhancedAltitude?: number;
  enhancedSpeed?: number;
  heading?: number;
  utcTimestamp?: Date;
  velocity?: number[];
}

export interface Message_CAMERA_EVENT {
  mesgNum: MesgNum.CAMERA_EVENT;
  timestamp?: Date;
  timestampMs?: number;
  cameraEventType?: string;
  cameraFileUuid?: string;
  cameraOrientation?: string;
}

export interface Message_TIMESTAMP_CORRELATION {
  mesgNum: MesgNum.TIMESTAMP_CORRELATION;
  timestamp?: Date;
  fractionalTimestamp?: number;
  systemTimestamp?: Date;
  fractionalSystemTimestamp?: number;
  localTimestamp?: number;
  timestampMs?: number;
  systemTimestampMs?: number;
}

export interface Message_GYROSCOPE_DATA {
  mesgNum: MesgNum.GYROSCOPE_DATA;
  timestamp?: Date;
  timestampMs?: number;
  sampleTimeOffset?: number[];
  gyroX?: number[];
  gyroY?: number[];
  gyroZ?: number[];
  calibratedGyroX?: number[];
  calibratedGyroY?: number[];
  calibratedGyroZ?: number[];
}

export interface Message_ACCELEROMETER_DATA {
  mesgNum: MesgNum.ACCELEROMETER_DATA;
  timestamp?: Date;
  timestampMs?: number;
  sampleTimeOffset?: number[];
  accelX?: number[];
  accelY?: number[];
  accelZ?: number[];
  calibratedAccelX?: number[];
  calibratedAccelY?: number[];
  calibratedAccelZ?: number[];
  compressedCalibratedAccelX?: number[];
  compressedCalibratedAccelY?: number[];
  compressedCalibratedAccelZ?: number[];
}

export interface Message_THREE_D_SENSOR_CALIBRATION {
  mesgNum: MesgNum.THREE_D_SENSOR_CALIBRATION;
  timestamp?: Date;
  sensorType?: string;
  calibrationFactor?: number[];
  calibrationDivisor?: number;
  levelShift?: number;
  offsetCal?: number[];
  orientationMatrix?: number[];
}

export interface Message_VIDEO_FRAME {
  mesgNum: MesgNum.VIDEO_FRAME;
  timestamp?: Date;
  timestampMs?: number;
  frameNumber?: number;
}

export interface Message_OBDII_DATA {
  mesgNum: MesgNum.OBDII_DATA;
  timestamp?: Date;
  timestampMs?: number;
  timeOffset?: number[];
  pid?: number;
  rawData?: number[];
  pidDataSize?: number[];
  systemTime?: number[];
  startTimestamp?: Date;
  startTimestampMs?: number;
}

export interface Message_NMEA_SENTENCE {
  mesgNum: MesgNum.NMEA_SENTENCE;
  timestamp?: Date;
  timestampMs?: number;
  sentence?: string;
}

export interface Message_AVIATION_ATTITUDE {
  mesgNum: MesgNum.AVIATION_ATTITUDE;
  timestamp?: Date;
  timestampMs?: number;
  systemTime?: number[];
  pitch?: number[];
  roll?: number[];
  accelLateral?: number[];
  accelNormal?: number[];
  turnRate?: number[];
  stage?: string[];
  attitudeStageComplete?: number[];
  track?: number[];
  validity?: number[];
}

export interface Message_VIDEO {
  mesgNum: MesgNum.VIDEO;
  url?: string;
  hostingProvider?: string;
  duration?: number;
}

export interface Message_VIDEO_TITLE {
  mesgNum: MesgNum.VIDEO_TITLE;
  messageIndex?: number;
  messageCount?: number;
  text?: string;
}

export interface Message_VIDEO_DESCRIPTION {
  mesgNum: MesgNum.VIDEO_DESCRIPTION;
  messageIndex?: number;
  messageCount?: number;
  text?: string;
}

export interface Message_VIDEO_CLIP {
  mesgNum: MesgNum.VIDEO_CLIP;
  clipNumber?: number;
  startTimestamp?: Date;
  startTimestampMs?: number;
  endTimestamp?: Date;
  endTimestampMs?: number;
  clipStart?: number;
  clipEnd?: number;
}

export interface Message_OHR_SETTINGS {
  mesgNum: MesgNum.OHR_SETTINGS;
  timestamp?: Date;
  enabled?: string;
}

export interface Message_EXD_SCREEN_CONFIGURATION {
  mesgNum: MesgNum.EXD_SCREEN_CONFIGURATION;
  screenIndex?: number;
  fieldCount?: number;
  layout?: string;
  screenEnabled?: boolean;
}

export interface Message_EXD_DATA_FIELD_CONFIGURATION {
  mesgNum: MesgNum.EXD_DATA_FIELD_CONFIGURATION;
  screenIndex?: number;
  conceptField?: number;
  fieldId?: number;
  conceptCount?: number;
  displayType?: string;
  title?: string[];
}

export interface Message_EXD_DATA_CONCEPT_CONFIGURATION {
  mesgNum: MesgNum.EXD_DATA_CONCEPT_CONFIGURATION;
  screenIndex?: number;
  conceptField?: number;
  fieldId?: number;
  conceptIndex?: number;
  dataPage?: number;
  conceptKey?: number;
  scaling?: number;
  dataUnits?: string;
  qualifier?: string;
  descriptor?: string;
  isSigned?: boolean;
}

export interface Message_FIELD_DESCRIPTION {
  mesgNum: MesgNum.FIELD_DESCRIPTION;
  developerDataIndex?: number;
  fieldDefinitionNumber?: number;
  fitBaseTypeId?: string;
  fieldName?: string;
  array?: number;
  components?: string;
  scale?: number;
  offset?: number;
  units?: string;
  bits?: string;
  accumulate?: string;
  fitBaseUnitId?: string;
  nativeMesgNum?: number;
  nativeFieldNum?: number;
}

export interface Message_DEVELOPER_DATA_ID {
  mesgNum: MesgNum.DEVELOPER_DATA_ID;
  developerId?: number[];
  applicationId?: number[];
  manufacturerId?: number;
  developerDataIndex?: number;
  applicationVersion?: number;
}

export interface Message_MAGNETOMETER_DATA {
  mesgNum: MesgNum.MAGNETOMETER_DATA;
  timestamp?: Date;
  timestampMs?: number;
  sampleTimeOffset?: number[];
  magX?: number[];
  magY?: number[];
  magZ?: number[];
  calibratedMagX?: number[];
  calibratedMagY?: number[];
  calibratedMagZ?: number[];
}

export interface Message_BAROMETER_DATA {
  mesgNum: MesgNum.BAROMETER_DATA;
  timestamp?: Date;
  timestampMs?: number;
  sampleTimeOffset?: number[];
  baroPres?: number[];
}

export interface Message_ONE_D_SENSOR_CALIBRATION {
  mesgNum: MesgNum.ONE_D_SENSOR_CALIBRATION;
  timestamp?: Date;
  sensorType?: string;
  calibrationFactor?: number;
  calibrationDivisor?: number;
  levelShift?: number;
  offsetCal?: number;
}

export interface Message_MONITORING_HR_DATA {
  mesgNum: MesgNum.MONITORING_HR_DATA;
  timestamp?: Date;
  restingHeartRate?: number;
  currentDayRestingHeartRate?: number;
}

export interface Message_TIME_IN_ZONE {
  mesgNum: MesgNum.TIME_IN_ZONE;
  timestamp?: Date;
  referenceMessageIndex?: number;
  referenceIndex?: number;
  timeInHrZone?: number[];
  timeInSpeedZone?: number[];
  timeInCadenceZone?: number[];
  timeInPowerZone?: number[];
  hrZoneHighBoundary?: number[];
  speedZoneHighBoundary?: number[];
  cadenceZoneHighBoundary?: number[];
  powerZoneHighBoundary?: number[];
  hrCalcType?: string;
  maxHeartRate?: number;
  restingHeartRate?: number;
  thresholdHeartRate?: number;
  pwrCalcType?: string;
  functionalThresholdPower?: number;
}

export interface Message_SET {
  mesgNum: MesgNum.SET;
  timestamp?: Date;
  duration?: number;
  repetitions?: number;
  weight?: number;
  setType?: string;
  startTime?: Date;
  category?: number[];
  categorySubtype?: number[];
  weightDisplayUnit?: string;
  messageIndex?: number;
  wktStepIndex?: number;
}

export interface Message_STRESS_LEVEL {
  mesgNum: MesgNum.STRESS_LEVEL;
  stressLevelValue?: number;
  stressLevelTime?: Date;
}

export interface Message_MAX_MET_DATA {
  mesgNum: MesgNum.MAX_MET_DATA;
  timestamp?: Date;
  updateTime?: Date;
  vo2Max?: number;
  sport?: string;
  subSport?: string;
  maxMetCategory?: string;
  calibratedData?: boolean;
  hrSource?: string;
  speedSource?: string;
}

export interface Message_DIVE_SETTINGS {
  mesgNum: MesgNum.DIVE_SETTINGS;
  messageIndex?: number;
  name?: string;
  model?: string;
  gfLow?: number;
  gfHigh?: number;
  waterType?: string;
  waterDensity?: number;
  po2Warn?: number;
  po2Critical?: number;
  po2Deco?: number;
  safetyStopEnabled?: boolean;
  bottomDepth?: number;
  bottomTime?: number;
  apneaCountdownEnabled?: boolean;
  apneaCountdownTime?: number;
  backlightMode?: string;
  backlightBrightness?: number;
  backlightTimeout?: string;
  repeatDiveInterval?: number;
  safetyStopTime?: number;
  heartRateSourceType?: string;
  heartRateSource?: number;
}

export interface Message_DIVE_GAS {
  mesgNum: MesgNum.DIVE_GAS;
  messageIndex?: number;
  heliumContent?: number;
  oxygenContent?: number;
  status?: string;
  mode?: string;
}

export interface Message_DIVE_ALARM {
  mesgNum: MesgNum.DIVE_ALARM;
  messageIndex?: number;
  depth?: number;
  time?: number;
  enabled?: boolean;
  alarmType?: string;
  sound?: string;
  diveTypes?: string;
}

export interface Message_EXERCISE_TITLE {
  mesgNum: MesgNum.EXERCISE_TITLE;
  messageIndex?: number;
  exerciseCategory?: ExerciseCategory;
  exerciseName?: number;
  wktStepName?: string;
}

export interface Message_DIVE_SUMMARY {
  mesgNum: MesgNum.DIVE_SUMMARY;
  timestamp?: Date;
  referenceMesg?: string;
  referenceIndex?: number;
  avgDepth?: number;
  maxDepth?: number;
  surfaceInterval?: number;
  startCns?: number;
  endCns?: number;
  startN2?: number;
  endN2?: number;
  o2Toxicity?: number;
  diveNumber?: number;
  bottomTime?: number;
  avgAscentRate?: number;
  avgDescentRate?: number;
  maxAscentRate?: number;
  maxDescentRate?: number;
  hangTime?: number;
}

export interface Message_SPO2_DATA {
  mesgNum: MesgNum.SPO2_DATA;
  timestamp?: Date;
  readingSpo2?: number;
  readingConfidence?: number;
  mode?: string;
}

export interface Message_SLEEP_LEVEL {
  mesgNum: MesgNum.SLEEP_LEVEL;
  timestamp?: Date;
  sleepLevel?: string;
}

export interface Message_JUMP {
  mesgNum: MesgNum.JUMP;
  timestamp?: Date;
  distance?: number;
  height?: number;
  rotations?: number;
  hangTime?: number;
  score?: number;
  positionLat?: number;
  positionLong?: number;
  speed?: number;
  enhancedSpeed?: number;
}

export interface Message_AAD_ACCEL_FEATURES {
  mesgNum: MesgNum.AAD_ACCEL_FEATURES;
  timestamp?: Date;
  aadAccelFeaturesVersion?: number;
  avgAbsAccel?: number[];
  avgAbsAccelDiff?: number[];
  stdDevAbsAccel?: number[];
  autocorrelation?: number[];
  autoregressiveCoefficient?: number[];
}

export interface Message_BEAT_INTERVALS {
  mesgNum: MesgNum.BEAT_INTERVALS;
  timestamp?: Date;
  timestampMs?: number;
  time?: number[];
}

export interface Message_RESPIRATION_RATE {
  mesgNum: MesgNum.RESPIRATION_RATE;
  timestamp?: Date;
  respirationRate?: number;
}

export interface Message_HSA_ACCELEROMETER_DATA {
  mesgNum: MesgNum.HSA_ACCELEROMETER_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  accelX?: number[];
  accelY?: number[];
  accelZ?: number[];
}

export interface Message_HSA_STEP_DATA {
  mesgNum: MesgNum.HSA_STEP_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  processingInterval?: number;
  stepCount?: number[];
}

export interface Message_HSA_SPO2_DATA {
  mesgNum: MesgNum.HSA_SPO2_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  processingInterval?: number;
  spo2?: number[];
  confidence?: number[];
  mode?: string[];
}

export interface Message_HSA_STRESS_DATA {
  mesgNum: MesgNum.HSA_STRESS_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  processingInterval?: number;
  stressLevel?: number[];
}

export interface Message_HSA_RESPIRATION_DATA {
  mesgNum: MesgNum.HSA_RESPIRATION_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  processingInterval?: number;
  respirationRate?: number[];
}

export interface Message_HSA_HEART_RATE_DATA {
  mesgNum: MesgNum.HSA_HEART_RATE_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  processingInterval?: number;
  heartRate?: number[];
  status?: string[];
}

export interface Message_SPLIT {
  mesgNum: MesgNum.SPLIT;
  splitType?: string;
  totalElapsedTime?: number;
  totalTimerTime?: number;
  totalDistance?: number;
  avgSpeed?: number;
  startTime?: Date;
  totalAscent?: number;
  totalDescent?: number;
  startPositionLat?: number;
  startPositionLong?: number;
  endPositionLat?: number;
  endPositionLong?: number;
  maxSpeed?: number;
  avgVertSpeed?: number;
  endTime?: Date;
  totalCalories?: number;
  startElevation?: number;
  messageIndex?: number;
}

export interface Message_SPLIT_SUMMARY {
  mesgNum: MesgNum.SPLIT_SUMMARY;
  splitType?: string;
  numSplits?: number;
  totalTimerTime?: number;
  totalDistance?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  totalAscent?: number;
  totalDescent?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgVertSpeed?: number;
  totalCalories?: number;
}

export interface Message_HSA_BODY_BATTERY_DATA {
  mesgNum: MesgNum.HSA_BODY_BATTERY_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  processingInterval?: number;
  level?: number[];
}

export interface Message_HSA_EVENT {
  mesgNum: MesgNum.HSA_EVENT;
  timestamp?: Date;
  data?: number[];
  dataLength?: number;
  eventType?: string;
  eventSubType?: string;
}

export interface Message_CLIMB_PRO {
  mesgNum: MesgNum.CLIMB_PRO;
  timestamp?: Date;
  positionLat?: number;
  positionLong?: number;
  climbProEvent?: string;
  climbNumber?: number;
  climbCategory?: number;
  currentDist?: number;
}

export interface Message_TANK_UPDATE {
  mesgNum: MesgNum.TANK_UPDATE;
  timestamp?: Date;
  sensor?: string;
  pressure?: number;
}

export interface Message_TANK_SUMMARY {
  mesgNum: MesgNum.TANK_SUMMARY;
  timestamp?: Date;
  sensor?: string;
  startPressure?: number;
  endPressure?: number;
  volumeUsed?: number;
}

export interface Message_SLEEP_ASSESSMENT {
  mesgNum: MesgNum.SLEEP_ASSESSMENT;
  combinedAwakeScore?: number;
  awakeTimeScore?: number;
  awakeningsCountScore?: number;
  deepSleepScore?: number;
  sleepDurationScore?: number;
  lightSleepScore?: number;
  overallSleepScore?: number;
  sleepQualityScore?: number;
  sleepRecoveryScore?: number;
  remSleepScore?: number;
  sleepRestlessnessScore?: number;
  awakeningsCount?: number;
  interruptionsScore?: number;
  averageStressScore?: number;
}

export interface Message_HRV_STATUS_SUMMARY {
  mesgNum: MesgNum.HRV_STATUS_SUMMARY;
  timestamp?: Date;
  weeklyAverage?: number;
  lastNightAverage?: number;
  lastNightFiveMinuteHigh?: number;
  baselineLowUpper?: number;
  baselineBalancedLower?: number;
  baselineBalancedUpper?: number;
  status?: string;
}

export interface Message_HRV_VALUE {
  mesgNum: MesgNum.HRV_VALUE;
  timestamp?: Date;
  value?: number;
}

export interface Message_RAW_BBI {
  mesgNum: MesgNum.RAW_BBI;
  timestamp?: Date;
  timestampMs?: number;
  data?: number[];
}

export interface Message_DEVICE_AUX_BATTERY_INFO {
  mesgNum: MesgNum.DEVICE_AUX_BATTERY_INFO;
  timestamp?: Date;
  deviceIndex?: number;
  batteryVoltage?: number;
  batteryStatus?: string;
  batteryIdentifier?: number;
}

export interface Message_HSA_GYROSCOPE_DATA {
  mesgNum: MesgNum.HSA_GYROSCOPE_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  gyroX?: number[];
  gyroY?: number[];
  gyroZ?: number[];
}

export interface Message_CHRONO_SHOT_SESSION {
  mesgNum: MesgNum.CHRONO_SHOT_SESSION;
  timestamp?: Date;
  minSpeed?: number;
  maxSpeed?: number;
  avgSpeed?: number;
  shotCount?: number;
  projectileName?: string;
  grainWeight?: number;
}

export interface Message_CHRONO_SHOT_DATA {
  mesgNum: MesgNum.CHRONO_SHOT_DATA;
  timestamp?: Date;
  shotNum?: number;
  shotSpeed?: number;
}

export interface Message_HSA_CONFIGURATION_DATA {
  mesgNum: MesgNum.HSA_CONFIGURATION_DATA;
  timestamp?: Date;
  data?: number[];
  dataSize?: number;
}

export interface Message_DIVE_APNEA_ALARM {
  mesgNum: MesgNum.DIVE_APNEA_ALARM;
  messageIndex?: number;
  depth?: number;
  time?: number;
  enabled?: boolean;
  alarmType?: string;
  sound?: string;
  diveTypes?: string;
}

export interface Message_SKIN_TEMP_OVERNIGHT {
  mesgNum: MesgNum.SKIN_TEMP_OVERNIGHT;
  timestamp?: Date;
  localTimestamp?: Date;
  avgDeviation?: number;
  avgNightlyDays?: number;
  nightly?: number[];
}

export interface Message_HSA_WRIST_TEMPERATURE_DATA {
  mesgNum: MesgNum.HSA_WRIST_TEMPERATURE_DATA;
  timestamp?: Date;
  timestampMs?: number[];
  processingInterval?: number;
  skinTemperature?: number[];
}

export interface Message_SLEEP_DISRUPTION_SEVERITY_PERIOD {
  mesgNum: MesgNum.SLEEP_DISRUPTION_SEVERITY_PERIOD;
  timestamp?: Date;
  durationMultiplier?: number;
  duration?: number[];
}

export interface Message_SLEEP_DISRUPTION_OVERNIGHT_SEVERITY {
  mesgNum: MesgNum.SLEEP_DISRUPTION_OVERNIGHT_SEVERITY;
  timestamp?: Date;
  disruption?: number[];
}

export enum ExerciseCategory {
  benchPress = 0,
  calfRaise = 1,
  cardio = 2,
  carry = 3,
  chop = 4,
  core = 5,
  crunch = 6,
  curl = 7,
  deadlift = 8,
  flye = 9,
  hipRaise = 10,
  hipStability = 11,
  hipSwing = 12,
  hyperextension = 13,
  lateralRaise = 14,
  legCurl = 15,
  legRaise = 16,
  lunge = 17,
  olympicLift = 18,
  plank = 19,
  plyo = 20,
  pullUp = 21,
  pushUp = 22,
  row = 23,
  shoulderPress = 24,
  shoulderStability = 25,
  shrug = 26,
  sitUp = 27,
  squat = 28,
  totalBody = 29,
  tricepsExtension = 30,
  warmUp = 31,
  run = 32,
  bike = 33,
  cardioSensors = 34,
  move = 35,
  pose = 36,
  bandedExercises = 37,
  battleRope = 38,
  elliptical = 39,
  floorClimb = 40,
  indoorBike = 41,
  indoorRow = 42,
  ladder = 43,
  sandbag = 44,
  sled = 45,
  sledgeHammer = 46,
  stairStepper = 47,
  suspension = 49,
  tire = 50,
  runIndoor = 52,
  bikeOutdoor = 53,
  unknown = 65534,
}
