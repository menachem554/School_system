export enum ProfessionEnum {
  ENGLISH = 'english',
  HISTORY = 'history',
  MATH = 'math',
  PHYSICS = 'physics',
  GEOGRAPHY = 'geography',
}
export interface ITacher {
  tName: String;
  age: Number;
  professionType: ProfessionEnum;
  studentList: number[];
  tacherID: number;
}
