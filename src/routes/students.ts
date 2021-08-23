/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import express, { Request, Response } from 'express';
import { IStudent } from '../interface/student.interface';
// import { IStudent } from '../interface/student.interface';
import StudentSchema from '../models/student.model';

const router = express.Router();

// Creating Student
router.post('/newStudent', async (req: Request, res: Response) => {
    const student  = new StudentSchema({
        sName: req.body.sName,
        age: req.body.age, 
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

  // Get one student
  router.get('/SID', async (req: Request, res: Response) => {
    try {
      const student : IStudent = await StudentSchema.findOne({studentID: req.query.studentID});
      res.send(student);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

   // Get student profession
   router.get('/profession/:studentID', async (req: Request, res: Response) => {
    try {
      const student : IStudent[] = await StudentSchema.aggregate(
        [{$match: {
          studentID: parseInt(req.params.studentID, 10)
        }}, {$lookup: {
          from: 'tachers',
          localField: 'studentList',
          foreignField: 'studentID',
          as: 'tachers'
        }}, {$unwind: {
          path: '$tachers',
        
        }}, {$project: {
          'professionType' : '$tachers.professionType',
          'studentList' : '$tachers.studentList'
        }}, {$match: {
          studentList : parseInt(req.params.studentID, 10)
        }}, {$project: {
           'professionType' :'$professionType' 
        }}]

      );
      res.send(student);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Edit student
  router.put('/editStudent', async (req: Request, res: Response) => {
    try {
    const student : IStudent = await StudentSchema.updateOne({studentID :req.query.studentID} , {
      sName: req.body.sName,
      age: req.body.age, 
      averageGrade: req.body.averageGrade, 
    })
    res.status(201).json(student);
  }
  catch(err : any){
    res.status(400).json({ message: err.message });
  }
  });

  // Delete student
router.delete('/del', async (req: Request, res: Response) => {
  try {
    const student : IStudent = await StudentSchema.deleteOne({studentID: req.query.studentID});
    res.status(200).send(student);
  }
  catch(err : any) {
    res.status(500).json({ message: err.message });
  }
});


export default router;

