/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import express, { Request, Response } from 'express';
import { ITacher } from '../interface/tacher.interface';
import TacherSchema from '../models/tacher.model';

const router = express.Router();

// Create Tacher
router.post('/newTacher', async (req: Request, res: Response) => {
  const tacher = new TacherSchema({
    tName: req.body.tName,
    age: req.body.age,
    professionType: req.body.professionType,
    studentList: req.body.studentList,
    tacherID: req.body.tacherID,
  });

  try {
    const newtacher = await tacher.save();
    res.status(201).json(newtacher);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Get Tacher by Name
router.get('/tName/:tName', async (req: Request, res: Response) => {
  try {
    const tacher : ITacher = await TacherSchema.findOne({tName: req.params.tName});
    res.send(tacher);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


// Get all students of tacher
router.get('/tacherID/:tacherID', async (req: Request, res: Response) => {
  try {
    const tacher : ITacher = await TacherSchema.findOne({tacherID: req.params.tacherID});
    res.send(tacher.studentList);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
