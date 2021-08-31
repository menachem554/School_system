import { Request, Response } from 'express';
import * as tacherManager from '../managers/tacher.manager';
import { ITacher } from '../interfaces/tacher.interface';

// Add Tacher
export const postTacher = async (req: Request, res: Response) => {
  try {
    // get all body Parameters
    const tacher = {
      tName: req.body.tName,
      age: req.body.age,
      professionType: req.body.professionType,
      studentList: req.body.studentList,
      tacherID: req.body.tacherID,
    };
    // Check that the profession is available
    if (
      await tacherManager.valProfession(tacher.professionType, tacher.tacherID)
    ) {
      res.status(400).send(`Error!
      There is already a teacher with this profession`);
    } else {
      // check for Duplicates values
      const { studentList } = req.body;
      const checkDuplicates = (arry) => new Set(arry).size !== arry.length;

      if (checkDuplicates(studentList)) {
        res.status(400).send(`Error!
       You are trying to add a duplicate ID`);
      }
      // check the paramters
      else if (await tacherManager.checkParamters(studentList)) {
        res.status(400).send(`Error!
       Only students enrolled in the system can be added`);
      } else {
        const newTacher = await tacherManager.postTacher(tacher);
        res.status(201).send(newTacher);
      }
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Print one teacher by ID
export const getTacher = async (req: Request, res: Response) => {
  try {
    const tacherID: number = parseInt(req.query.tacherID as string, 10);
    const tacher: ITacher = await tacherManager.getTacher(tacherID);
    res.send(tacher);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Edit tacher
export const editTacher = async (req: Request, res: Response) => {
  const tID: number = parseInt(req.query.tacherID as string, 10);
  const tacher = {
    tName: req.body.tName,
    age: req.body.age,
    professionType: req.body.professionType,
    studentList: req.body.studentList,
    tacherID: tID,
  };
  try {
    // Check that the ids is in the system
    if (await tacherManager.checkParamters(tacher.studentList)) {
      res.status(400).send(`Error!
       Only students enrolled in the system can be added`);
      // Check that profession is good
    } else if (
      await tacherManager.valProfession(tacher.professionType, tacher.tacherID)
    ) {
      res.status(400).send(`Error!
      There is already a teacher with this profession`);
    } else {
      // check for Duplicates values
      const { studentList } = req.body;
      const checkDuplicates = (arry) => new Set(arry).size !== arry.length;

      if (checkDuplicates(studentList)) {
        res.status(400).send(`Error!
       You are trying to add a duplicate ID`);
      } else {
        // Save the changes
        const printEdit = await tacherManager.editTacher(
          tacher.tacherID,
          tacher
        );
        res.status(201).json(printEdit);
      }
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete tacher
export const delTacher = async (req: Request, res: Response) => {
  const tID: number = parseInt(req.query.tacherID as string, 10);
  try {
    const tacher = await tacherManager.delTacher(tID);
    res.status(200).send(tacher);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get tacher students list (no Query Params here)
export const getTacherStudents = async (req: Request, res: Response) => {
  const tID: number = parseInt(req.params.tacherID, 10);
  try {
    const tacher = await tacherManager.getTacherStudents(tID);
    res.send(tacher);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Print the outsanding tacher
export const getOutsandingTacher = async (_req: Request, res: Response) => {
  try {
    const tacher = await tacherManager.getOutsandingTacher();
    res
      .status(200)
      .send(
        `the outsanding tacher is ${tacher[2]}, tacherID: ${tacher[1]}, with average Grade of ${tacher[0]}`
      );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
