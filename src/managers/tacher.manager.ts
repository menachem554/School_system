import { IStudent } from '../interfaces/student.interface';
import { ITacher } from '../interfaces/tacher.interface';
import * as studentRepo from '../repositories/student.repo';
import * as tacherRepo from '../repositories/tacher.repo';

// Save new tacher
export const postTacher = async (tacher: ITacher) => {
  const addTacher = await tacherRepo.postTacher(tacher);
  return addTacher;
};

// Get one tacher
export const getTacher = async (tacherID: number) => {
  const tacher: ITacher = await tacherRepo.getTacher(tacherID);
  return tacher;
};

// Edit tacher
export const editTacher = async (tacherID: number, tacher: ITacher) => {
  const edit = await tacherRepo.editTacher(tacherID, tacher);
  return edit;
};

// Delete tacher
export const delTacher = async (tID: number) => {
  const tDel: ITacher = await tacherRepo.delTacher(tID);
  return tDel;
};

// Get all students of tacher
export const getTacherStudents = async (tacherID: number) => {
  const tacher = await tacherRepo.studentList(tacherID);
  return tacher;
};

// get Outsanding Tacher
export const getOutsandingTacher = async () => {
  const grade = await tacherRepo.getOutsandingTacher();

  let studensGrade: number[] = [];
  let sum: number = 0;
  let calculat: number = 0;
  let tempResult: number = 0;
  const Outsanding: [number, number, String] = [0, 0, ''];

  grade.forEach((doc) => {
    studensGrade = doc.averageGrade;
    sum = studensGrade.length;

    for (let i: number = 0; i < sum; i += 1) {
      calculat += studensGrade[i];
    }

    tempResult = calculat / sum;
    calculat = 0;

    if (Outsanding[0] < tempResult) {
      Outsanding[0] = tempResult;
      Outsanding[1] = doc.tacherID;
      Outsanding[2] = doc.tName;
    }
  });
  return Outsanding;
};

// check parameters for post and edit
export const checkParamters = async (
  studentList: number[]
): Promise<boolean> => {
  let isGood: boolean = false;

  // Get the ids of the students for validation
  const student: IStudent[] = await studentRepo.idsOfStudents();

  const studentIds: number[] = [];

  // get the ids ass an arry
  student.forEach((doc) => {
    studentIds.push(doc.studentID);
  });

  // check for unexist ID
  for (let i: number = 0; i < studentList.length; i += 1) {
    if (!studentIds.includes(studentList[i])) {
      isGood = true;
      break;
    }
  }

  return isGood;
};

// Validate the profession type of tacher
export const valProfession = async (
  profession: String,
  tacherID: number
): Promise<boolean> => {
  let isGood: boolean = false;
  let professionType: String = '';
  let tacherIDs: number = 0;

  // Get the professionType of all tacher
  const tacher: ITacher[] = await tacherRepo.professionType();

  tacher.forEach(async (doc) => {
    professionType = doc.professionType;
    tacherIDs = doc.tacherID;

    // Check if professionType is already belongs to other tacher
    if (profession === professionType && tacherID !== tacherIDs) {
      isGood = true;
    }
  });
  return isGood;
};

// Delete student from tacher
export const delStudentFromTacher = async (studentID: number) => {
  let studentList: number[] = [];
  let tacherIDs: number = 0;

  // Aggregate list of all students with tachers
  const tacher: ITacher[] = await tacherRepo.tachersList();

  tacher.forEach(async (doc) => {
    studentList = doc.studentList;
    tacherIDs = doc.tacherID;

    for (let i: number = 0; i < studentList.length; i += 1) {
      if (studentID === studentList[i]) {
        const del = tacherRepo.delSsntFromTchr(tacherIDs, studentList[i]);
        console.log(del);
      }
    }
  });
};
