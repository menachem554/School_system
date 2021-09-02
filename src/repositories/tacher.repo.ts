import { ITacher } from '../interfaces/tacher.interface';
import TacherSchema from '../models/tacher.model';

// Aggregate list of all professionType
export const professionType = async () => {
  const tacher: ITacher[] = await TacherSchema.aggregate([
    {
      $project: {
        professionType: '$professionType',
        tacherID: '$tacherID',
      },
    },
  ]);

  return tacher;
};

// Aggregate the students names
export const studentList = async (tacherID: number) => {
  const tacher: ITacher[] = await TacherSchema.aggregate([
    {
      $match: {
        tacherID,
      },
    },
    {
      $lookup: {
        from: 'students',
        localField: 'studentList',
        foreignField: 'studentID',
        as: 'StudentName',
      },
    },
    {
      $unwind: {
        path: '$StudentName',
      },
    },
    {
      $project: {
        StudentName: '$StudentName',
      },
    },
  ]);

  return tacher;
};

// Aggregate the students.averageGrade + tacherID + tName
export const getOutsandingTacher = async () => {
  const grade = await TacherSchema.aggregate([
    {
      $lookup: {
        from: 'students',
        localField: 'studentList',
        foreignField: 'studentID',
        as: 'students',
      },
    },
    {
      $project: {
        averageGrade: '$students.averageGrade',
        tacherID: '$tacherID',
        tName: '$tName',
      },
    },
  ]);
  return grade;
};

// Aggregate list of all students with tachers
export const tachersList = async () => {
  const tacher: ITacher[] = await TacherSchema.aggregate([
    {
      $project: {
        tacherID: '$tacherID',
        studentList: '$studentList',
      },
    },
  ]);
  return tacher;
};

// delete staudent from tacher
export const delSsntFromTchr = async (tacherIDs: number, sList: number) => {
  const del: ITacher = await TacherSchema.updateOne(
    { tacherID: tacherIDs },
    { $pull: { studentList: sList } }
  );
  return del;
};

// Aggregate list of all students with tachers
export const getTacherStudentList = async () => {
  const tacher: ITacher[] = await TacherSchema.aggregate([
    {
      $lookup: {
        from: 'students',
        localField: 'studentList',
        foreignField: 'studentID',
        as: 'students',
      },
    },
    {
      $project: {
        studentList: '$studentList',
      },
    },
  ]);
  return tacher;
};

// Save new tacher
export const postTacher = async (tacher: ITacher) => {
  const addTacher = new TacherSchema(tacher);
  await addTacher.save();
  return addTacher;
};

// Get one tacher
export const getTacher = async (tacherID: number) => {
  const tacher: ITacher = await TacherSchema.findOne({ tacherID });
  return tacher;
};
// Edit tacher
export const editTacher = async (tacherID: number, tacher: ITacher) => {
  const edit: ITacher = await TacherSchema.updateOne(
    { tacherID },
    {
      tName: tacher.tName,
      age: tacher.age,
      professionType: tacher.professionType,
      studentList: tacher.studentList,
    }
  );
  return edit;
};

// Delete tacher
export const delTacher = async (tID: number) => {
  const tDel: ITacher = await TacherSchema.deleteOne({ tacherID: tID });
  return tDel;
};
