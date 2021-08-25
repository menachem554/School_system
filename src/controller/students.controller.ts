import express, { Request, Response } from 'express';
import { IStudent } from '../interface/student.interface';
import { ITacher } from '../interface/tacher.interface';
import StudentSchema from '../models/student.model';
import TacherSchema from '../models/tacher.model';

const router = express.Router();

// Add Student
export const postStudent = async (req: Request, res: Response) => {
  const student = new StudentSchema({
    // get all body Parameters
    sName: req.body.sName,
    age: req.body.age,
    averageGrade: req.body.averageGrade,
    studentID: req.body.studentID,
  });

  // Save the new student
  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Print one students by ID
export const getStudent = async (req: Request, res: Response) => {
  try {
    const student: IStudent = await StudentSchema.findOne({
      studentID: req.query.studentID,
    });
    res.send(student);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Edit student
export const editStudent = async (req: Request, res: Response) => {
  try {
    const student: IStudent = await StudentSchema.updateOne(
      { studentID: req.query.studentID },
      {
        sName: req.body.sName,
        age: req.body.age,
        averageGrade: req.body.averageGrade,
      }
    );
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete student
export const delStudent = async (req: Request, res: Response) => {
  try {
    const student: IStudent = await StudentSchema.deleteOne({
      studentID: req.query.studentID,
    });
    res.status(200).send(student);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get student profession (no Query Params here)
export const getStudentProfession = async (req: Request, res: Response) => {
  try {
    // Aggregate the students profession from tachers collection
    const student: IStudent[] = await StudentSchema.aggregate([
      {
        $match: {
          studentID: parseInt(req.params.studentID, 10),
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
          studentList: parseInt(req.params.studentID, 10),
        },
      },
      {
        $project: {
          professionType: '$professionType',
        },
      },
    ]);
    res.send(student);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tacherles students
export const getTacherlesStudent = async (_req: Request, res: Response) => {
  try {
    // Aggregate list of all students with tachers
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

    const student: IStudent[] = await StudentSchema.aggregate([
      // Aggregate all ids of students
      {
        $project: {
          sName: '$sName',
          studentID: '$studentID',
        },
      },
    ]);

    let studentID: number[] = [];
    let sName: String[] = [];
    let studentList: number[] = [];
    let allstudentList: number[] = [];
    let tacherls: String[] = [];

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

    res.status(200).send(tacherls);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default router;
