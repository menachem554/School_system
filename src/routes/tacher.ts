/* eslint-disable no-plusplus */
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
router.get('/TID', async (req: Request, res: Response) => {
  try {
    const tacher : ITacher = await TacherSchema.findOne({tacherID: req.query.tacherID});
    res.send(tacher);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


// Get all students of tacher
router.get('/tacherID/:tacherID', async (req: Request, res: Response) => {
  try {
    const tacher : ITacher[] = await TacherSchema.aggregate(
      [{$match: {
        'tacherID' : parseInt(req.params.tacherID, 10)
      }}, {$lookup: {
        from: 'students',
        localField: 'studentList',
        foreignField: 'studentID',
        as: 'StudentName'
      }}, {$unwind: {
        'path': '$StudentName'
      
      }}, {$project: {
        'StudentName' : '$StudentName'
      }}]
    );
    res.send(tacher);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Edit tacher
router.put('/editTacher', async (req: Request, res: Response) => {
  try {
  const tacher : ITacher = await TacherSchema.updateOne({tacherID :req.query.tacherID} , {
    tName: req.body.tName,
    age: req.body.age,
    professionType: req.body.professionType,
    studentList: req.body.studentList,
  })
  res.status(201).json(tacher);
}
catch(err : any){
  res.status(400).json({ message: err.message });
}
});

// Delete tacher
router.delete('/del', async (req: Request, res: Response) => {
  try {
    const tacher : ITacher = await TacherSchema.deleteOne({tacherID: req.query.tacherID});
    res.status(200).send(tacher);
  }
  catch(err : any) {
    res.status(500).json({ message: err.message });
  } 
})

// outsanding tacher
router.get('/outsanding', async (_req: Request, res: Response) => {
  const grade : ITacher[]  = await TacherSchema.aggregate(
    [{$lookup: {
      from: 'students',
      localField: 'studentList',
      foreignField: 'studentID',
      as: 'students'
    }}, {$project: {
      'averageGrade': '$students.averageGrade',
      'tacherID' : '$tacherID'
    }}]
  );
  let theNumber : number[];
  // eslint-disable-next-line no-unused-vars
  let sum : number; 
  let calulcut : number;
  calulcut = 0;
  let result : number;
  grade.forEach((doc) => {
    theNumber = doc.averageGrade;
    sum = theNumber.length;

    console.log(theNumber);
    console.log(sum);
    
    for(let i : number = 0; i < sum; i++ ){
      calulcut += theNumber[i];   
    }
    result = calulcut / sum
    console.log(`the average of tacher ${doc.tacherID} is ${result} `);
      
    });
    res.status(200);
})






export default router;
