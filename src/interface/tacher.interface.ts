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
