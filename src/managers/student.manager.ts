import { IStudent } from '../interfaces/student.interface';
import { ITacher } from '../interfaces/tacher.interface';
import * as studentRepo from '../repositories/student.repo';
import * as tacherRepo from '../repositories/tacher.repo';

// Save new student
export const postStudent = async (student: IStudent) => {
  const addStudent = await studentRepo.postStudent(student);
  return addStudent;
};

// Get one student
export const getStudent = async (studentID: number) => {
  const student: IStudent = await studentRepo.getStudent(studentID);
  return student;
};

// Edit student
export const editStudent = async (studentID: number, student: IStudent) => {
  const edit = await studentRepo.editStudent(studentID, student);
  return edit;
};

// Delete student
export const delStudent = async (sID: number) => {
  const sDel: IStudent = await studentRepo.delStudent(sID);
  return sDel;
};

// Get student Profession
export const getStudentProfession = async (studentID: number) => {
  const student: IStudent[] = await studentRepo.getStudentProfession(studentID);
  return student;
};

// Get all students tacherles
export const getTacherlesStudent = async () => {
  const tacher: ITacher[] = await tacherRepo.getTacherStudentList();
  const student: IStudent[] = await studentRepo.idsOfStudents();

  const studentID: number[] = [];
  const sName: String[] = [];
  let studentList: number[] = [];
  const allstudentList: number[] = [];
  const tacherls: String[] = [];

  tacher.forEach((doc) => {
    studentList = doc.studentList;

    // get the list of students thate have tachers ass arry
    for (let i: number = 0; i < studentList.length; i += 1) {
      allstudentList.push(studentList[i]);
    }
  });

  student.forEach((doc) => {
    studentID.push(doc.studentID);
    sName.push(doc.sName);
  });

  // Fill out the list of tacherles students
  for (let i: number = 0; i < studentID.length; i += 1) {
    if (!allstudentList.includes(studentID[i])) {
      tacherls.push(sName[i]);
    }
  }
  return tacherls;
};
