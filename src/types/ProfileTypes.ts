// @ts-ignore
// import {Profile} from '../../node_modules/@garmin/fitsdk/src/profile.js';

//
// import {Profile} from '../types_generated';
//
// const CardioExerciseName = Profile.types.cardioExerciseName;
//
// for(const exName in  Profile.types){
//   exName.endsWith('ExerciseName') && console.log(exName);
//
// }
// Object.keys(Profile.types).filter(key => key.endsWith('ExerciseName')).map(key => {
//   Profile.types[key];
// });


// function mapObject<K extends string, T, U>(
//   obj: Record<K, T>,
//   f: (x: T) => U
// ): Record<K, U>;

// type Partial<T> = {
//   [P in keyof T]?: T[P];
// };
// type CardioExerciseName = Partial<Profile.types.cardioExerciseName>;
// class test{
//   CardioExerciseName.
// }

// import {Profile} from '../types_generated';
//
// const mesgNumSource = {...Profile.types.mesgNum} as const;
// const fileSource = {...Profile.types.file} as const;
// const sportSource = {...Profile.types.sport} as const;
// const subSportSource = {...Profile.types.subSport} as const;

// for (const key in [MesgNumType]) {
//   type key = {
//     [K in typeof mesgNumSource[keyof typeof mesgNumSource]]: number;
//   };
// }

/*type MesgNumType = {
  [K in typeof mesgNumSource[keyof typeof mesgNumSource]]: number;
};
const MesgNum = Object.entries(mesgNumSource).reduce(
  (acc, [key, value]) => {
    acc[value] = Number(key);
    return acc;
  },
  {} as MesgNumType
);*/
/*

type FileType = {
  [K in typeof fileSource[keyof typeof fileSource]]: number;
};
const FileType = Object.entries(fileSource).reduce(
  (acc, [key, value]) => {
    acc[value] = Number(key);
    return acc;
  },
  {} as FileType
);

type Sport = {
  [K in typeof sportSource[keyof typeof sportSource]]: number;
};
const Sport = Object.entries(sportSource).reduce(
  (acc, [key, value]) => {
    acc[value] = Number(key);
    return acc;
  },
  {} as Sport
);

type SubSport = {
  [K in typeof subSportSource[keyof typeof subSportSource]]: number;
};
const SubSport = Object.entries(subSportSource).reduce(
  (acc, [key, value]) => {
    acc[value] = Number(key);
    return acc;
  },
  {} as SubSport
);


 */
