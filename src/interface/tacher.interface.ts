/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
export enum ProfessionEnum {
  ENGLISH = 'english',
  HISTORY = 'history',
  MATH = 'math',
  PHYSICS = 'physics',
  GEOGRAPHY = 'geography'
}
export interface ITacher {
  tName: String;
  ages: Number;
  professionType: ProfessionEnum; 
  idNum: number; 
}
