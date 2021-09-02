import StudentSchema from '../models/student.model';
import { IStudent } from '../interfaces/student.interface';

// Save new student
export const postStudent = async (student: IStudent) => {
  const addStudent = new StudentSchema(student);
  await addStudent.save();
  return addStudent;
};

// Get one Student
export const getStudent = async (studentID: number) => {
  const student: IStudent = await StudentSchema.findOne({ studentID });
  return student;
};

// Edit student
export const editStudent = async (studentID: number, student: IStudent) => {
  const edit: IStudent = await StudentSchema.updateOne(
    { studentID },
    {
      sName: student.sName,
      age: student.age,
      averageGrade: student.averageGrade,
    }
  );
  return edit;
};

// Delete student
export const delStudent = async (sID: number) => {
  const sDel: IStudent = await StudentSchema.deleteOne({ studentID: sID });
  return sDel;
};

// Aggregate the students profession from tachers collection
export const getStudentProfession = async (studentID: number) => {
  const student = await StudentSchema.aggregate([
    {
      $match: {
        studentID,
      },
    },
    {
      $lookup: {
        from: 'tachers',
        localField: 'studentList',
        foreignField: 'studentID',
        as: 'tachers',
      },
    },
    {
      $unwind: {
        path: '$tachers',
      },
    },
    {
      $project: {
        professionType: '$tachers.professionType',
        studentList: '$tachers.studentList',
      },
    },
    {
      $match: {
        studentList: studentID,
      },
    },
    {
      $project: {
        professionType: '$professionType',
      },
    },
  ]);
  return student;
};

// Aggregate all ids of students
export const idsOfStudents = async () => {
  const student: IStudent[] = await StudentSchema.aggregate([
    {
      $project: {
        sName: '$sName',
        studentID: '$studentID',
      },
    },
  ]);
  return student;
};
