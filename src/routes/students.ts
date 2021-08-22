/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import express, { Request, Response } from 'express';
// import { IStudent } from '../interface/student.interface';
import StudentSchema from '../models/student.model';

const router = express.Router();

// Creating Tacher
router.post('/newStudent', async (req: Request, res: Response) => {
    const student  = new StudentSchema({
        sName: req.body.sName,
        age: req.body.age, 
        tacherID: req.body.tacherID,
        averageGrade: req.body.averageGrade,  
        studentID: req.body.studentID,
    });
  
    try {
      const newStudent = await student.save();
      res.status(201).json(newStudent);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

export default router;

