import express, { Request, Response } from 'express';
import { IStudent } from '../interface/student.interface';
import { ITacher } from '../interface/tacher.interface';
import TacherSchema from '../models/tacher.model';
import StudentSchema from '../models/student.model';

const router = express.Router();

// function for post and edit
const checkParamters = async (
  req: Request,
  res: Response
): Promise<boolean> => {
  let isGood: boolean = true;
  // Aggregate all ids of the students for validation
  const student: IStudent[] = await StudentSchema.aggregate([
    {
      $project: {
        studentID: '$studentID',
      },
    },
  ]);

  const studentIds: number[] = [];

  // get the ids ass an arry
  student.forEach((doc) => {
    studentIds.push(doc.studentID);
  });

  // check for Duplicates values
  const { studentList } = req.body;
  const checkDuplicates = (arry) => new Set(arry).size !== arry.length;

  if (checkDuplicates(studentList)) {
    res.status(400).send('Error! You are trying to add a duplicate ID');
    isGood = false;
  } else {
    // check for unexist ID
    for (let i: number = 0; i < studentList.length; i += 1) {
      if (!studentIds.includes(studentList[i])) {
        res
          .status(400)
          .send(
            'Error! You are trying to add studentID that is not registered in the system'
          );
        isGood = false;
        break;
      }
    }
  }
  return isGood;
};

// validate the profession type of tacher
const valProfession = async (
  _req: Request,
  res: Response,
  profession: String,
  tacherID: number
): Promise<boolean> => {
  let isGood: boolean = true;
  let professionType: String = '';
  let tacherIDs: number = 0;

  // Aggregate list of all professionType
  const tacher: ITacher[] = await TacherSchema.aggregate([
    {
      $project: {
        professionType: '$professionType',
        tacherID: '$tacherID',
      },
    },
  ]);

  tacher.forEach(async (doc) => {
    professionType = doc.professionType;
    tacherIDs = doc.tacherID;

    if (profession === professionType && tacherID !== tacherIDs) {
      res.status(500).send(`'The profession you are trying to enter
       is already taken by another teacher`);
      isGood = false;
    }
  });
  return isGood;
};

// Add Tacher
export const postTacher = async (req: Request, res: Response) => {
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
    if (await checkParamters(req, res)) {
      if (
        await valProfession(
          req,
          res,
          req.body.professionType,
          req.body.tacherID
        )
      ) {
        const newtacher = await tacher.save();
        res.status(201).json(newtacher);
      }
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Print one teacher by ID
export const getTacher = async (req: Request, res: Response) => {
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
export const editTacher = async (req: Request, res: Response) => {
  const tId: number = parseInt(req.query.tacherID as string, 10);
  try {
    if (await checkParamters(req, res)) {
      if (await valProfession(req, res, req.body.professionType, tId)) {
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
export const delTacher = async (req: Request, res: Response) => {
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

// Delete student from tacher
export const delStudentFromTacher = async (studentID: number) => {
  let studentList: number[] = [];
  let tacherIDs: number = 0;

  // Aggregate list of all students with tachers
  const tacher: ITacher[] = await TacherSchema.aggregate([
    {
      $project: {
        tacherID: '$tacherID',
        studentList: '$studentList',
      },
    },
  ]);

  tacher.forEach(async (doc) => {
    studentList = doc.studentList;
    tacherIDs = doc.tacherID;

    for (let i: number = 0; i < studentList.length; i += 1) {
      if (studentID === studentList[i]) {
        // eslint-disable-next-line no-await-in-loop
        const del: ITacher = await TacherSchema.updateOne(
          { tacherID: tacherIDs },
          { $pull: { studentList: studentList[i] } }
        );
        console.log(del);
      }
    }
  });
};

export default router;
