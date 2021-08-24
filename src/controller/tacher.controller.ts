/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-unresolved */

import express, { Request, Response } from 'express';
import { IStudent } from '../interface/student.interface';
import { ITacher } from '../interface/tacher.interface';
import TacherSchema from '../models/tacher.model';
import StudentSchema from '../models/student.model';

const router = express.Router();

// Add Tacher
export const postTacher =  async (req: Request, res: Response) => {
  // get all body Parameters
  const tacher = new TacherSchema({
    tName: req.body.tName,
    age: req.body.age,
    professionType: req.body.professionType,
    studentList: req.body.studentList,
    tacherID: req.body.tacherID,
  });

  // Save the new tacher
  try {
    const newtacher = await tacher.save();
    res.status(201).json(newtacher);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Print one teacher by ID
export const getTacher =  async (req: Request, res: Response) => {
  try {
    const tacher: ITacher = await TacherSchema.findOne({
      tacherID: req.query.tacherID,
    });
    res.send(tacher);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Edit tacher
export const editTacher =  async (req: Request, res: Response) => {
  // Aggregate all ids of the students for validation
  try {
    const student: IStudent[] = await StudentSchema.aggregate([
      {
        $project: {
          studentID: '$studentID',
        },
      },
    ]);

    const studentIds: number[] = [];
    let isGood: boolean = true;

    // get the ids ass an arry
    student.forEach((doc) => {
      studentIds.push(doc.studentID);
    });

    // check for Duplicates values
    const studentList: number[] = req.body.studentList;
    let checkDuplicates  = (arry) => new Set(arry).size !== arry.length

    if (checkDuplicates(studentList)){
      res.status(400).send('Error! You are trying to add a duplicate ID');  
    }
    else{
      // check for unexist ID
    for (let i: number = 0; i < studentList.length; i += 1) {
      if (!studentIds.includes(studentList[i])) {
        res.status(400).send('Error! You are trying to add studentID that is not registered in the system');
        isGood = false;
        break;
      }
    }

    if (isGood) {
      // Save the changes
      const tacher: ITacher = await TacherSchema.updateOne(
        { tacherID: req.query.tacherID },
        {
          tName: req.body.tName,
          age: req.body.age,
          professionType: req.body.professionType,
          studentList: req.body.studentList,
        }
      );
      res.status(201).json(tacher);
    }
  }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete tacher
export const delTacher =  async (req: Request, res: Response) => {
  try {
    const tacher: ITacher = await TacherSchema.deleteOne({
      tacherID: req.query.tacherID,
    });
    res.status(200).send(tacher);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get tacher students list (no Query Params here)
export const getTacherStudents = async (req: Request, res: Response) => {
  try {
    // Aggregate the students names 
    const tacher: ITacher[] = await TacherSchema.aggregate([
      {
        $match: {
          tacherID: parseInt(req.params.tacherID, 10),
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
    res.send(tacher);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Print the outsanding tacher
export const getoutsandingTacher = async (_req: Request, res: Response) => {
  try {
    // Aggregate average Grade of the students, and tacher IDs and names
    const grade: ITacher[] = await TacherSchema.aggregate([
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

    let studensGrade: number[] = [];
    let sum: number = 0;
    let calculat: number = 0;
    let tempResult: number = 0;
    let result: number = 0;
    let tacherID: number = 0;
    let tacherName: String = '';

    grade.forEach((doc) => {
      studensGrade = doc.averageGrade;
      sum = studensGrade.length;

      for (let i: number = 0; i < sum; i += 1) {
        calculat += studensGrade[i];
      }

      tempResult = calculat / sum;
      calculat = 0;

      if (result < tempResult) {
        result = tempResult;
        tacherID = doc.tacherID;
        tacherName = doc.tName;
      }
    });

    console.log();
    res
      .status(200)
      .send(
        `the outsanding tacher is ${tacherName}, tacherID: ${tacherID}, with average Grade of ${result}`
      );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default router;
