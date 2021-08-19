/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

// eslint-disable-next-line no-shadow
enum ProfessionEnum {
  Math,
  History,
  English,
  geography,
  Physics,
}

export interface IStudent {
  name: String; // unique
  age: number; // 12-20
  professionType: String; // Limited of 3
  averageGrade: number; //
  studentNum: number; //
}

export default ProfessionEnum;
