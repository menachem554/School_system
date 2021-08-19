/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-unresolved
import  {ProfessionEnum}  from './student.interface';

// Tachers collection:  will contain a list of tachers
export interface ITacher {
  tName: String;
  ages: Number;
  professionType: ProfessionEnum; // Limited of 1
  studentsList: number[]; // Limited of 10-32, age of student is the same || -1
  idNum: number; //
}
