/* eslint-disable no-shadow */
export enum ProfessionEnum {
  ENGLISH = 'english',
  HISTORY = 'history',
  MATH = 'math',
  PHYSICS = 'physics',
  GEOGRAPHY = 'geography',
}
export interface ITacher {
  averageGrade: any;
  tName: String;
  age: Number;
  professionType: ProfessionEnum;
  studentList: number[];
  tacherID: number;
}
