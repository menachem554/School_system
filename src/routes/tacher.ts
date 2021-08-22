/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import express, { Request, Response } from 'express';
import TacherSchema from '../models/tacher.model';
import {ITacher} from '../interface/tacher.interface';

const router = express.Router();

// Creating Tacher
// router.post('/api/tacher/newTacher', async (req: Request, res: Response) => {
//   const tacher = new TacherSchema({
//     tName: req.body.tName,
//     ages: req.body.age,
//     professionType: req.body.professionType,
//     idNum: req.body.idNum,
//   });

//   try {
//     const newtacher = await tacher.save();
//     res.status(201).json(newtacher);
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Get all authors
router.get('/api/tacher', async (_req: Request, res: Response) => {
  const getTacher: ITacher = await TacherSchema.find({"first name":"menachem"});
  res.send(getTacher);
});

export default router;
